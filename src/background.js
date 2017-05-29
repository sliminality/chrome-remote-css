// @flow
type Socket = Object;
type Target = {
  tabId: number,
};
type NodeId = number;

declare var io: (string, ?Object) => Socket;
declare var ChromePromise;
declare var chrome: Object;

const cp = new ChromePromise();
const PROTOCOL = '1.2';
const SOCKET_PORT = 1111;

class BrowserEndpoint {
  socket: ?Socket;
  target: ?Target;
  document: ?Node;
  inspectedNode: ?Node;

  _debugEventDispatch: (Target, string, Object) => Promise<*>;

  constructor(port) {
    this.socket = io(`http://localhost:${port}/browsers`, {
      autoConnect: false,
      reconnectionAttempts: 5,
    });
    this.target = null;
    this.document = null;
    this.inspectedNode = null;

    // Bind `this` in the constructor, so we can
    // detach event handler by reference during cleanup.
    this._debugEventDispatch = this._debugEventDispatch.bind(this);
  }

  /**
   * Get the currently active tab in the focused Chrome
   * instance.
   */
  static async getActiveTab() {
    const tabs = await cp.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tabs.length === 0) {
      throw new Error('getActiveTab: no active tab found');
    } else {
      return tabs[0];
    }
  }

  /**
   * Prepare to receive requests for debugger data.
   */
  async initConnections(tabId) {
    // Mount debugger.
    await cp.debugger.attach({ tabId }, PROTOCOL);

    this.target = { tabId };
    chrome.debugger.onDetach
      .addListener(this._onDebuggerDetach.bind(this));
    chrome.debugger.onEvent
      .addListener(this._debugEventDispatch);
    console.log('Attached debugger to target', this.target);

    // Once debugger is mounted, get the DOM.
    this.document = await this.getDocumentRoot();
    console.log('Retrieved document root', this.document);

    // Once we have the DOM and are ready to handle
    // incoming requests, open the socket.
    if (this.socket) {
      // Need to store the value of this.socket to
      // prevent Flow from invalidating the refinement.
      const { socket } = this;
      await (new Promise(resolve => {
        socket.open();
        socket.on('data.req', this.onRequest.bind(this));
        socket.on('disconnect', this._onSocketDisconnect.bind(this));
        socket.on('connect', resolve);
      }));
      console.log('Opened socket', this.socket);
    } else {
      console.error('No socket found, could not setup connections');
    }
  }

  /**
   * Set the root of the document.
   */
  async getDocumentRoot() {
    const { root } = await this._sendDebugCommand({
      method: 'DOM.getDocument',
      params: { depth: -1 },
    });
    // Set parentId value on every node.
    const withParents = this._addParentIds(-1)(root);
    return withParents;
  }

  /**
   * Allow the user to select a node for focus.
   */
  async selectNode() {
    let backendNodeId: NodeId;

    // Activate inspect mode.
    const highlightConfig: HighlightConfig = {
      contentColor: {
        r: 255, g: 0, b: 0, a: 0.3,
      },
    };

    // Launch inspect mode.
    this._sendDebugCommand({ method: 'DOM.setInspectMode',
      params: {
        mode: 'searchForNode',
        highlightConfig,
      },
    });
  }

  /**
   * Set parentId on every node in a given tree.
   */
  _addParentIds(parentId) {
    return node => {
      const { children, nodeId } = node;
      if (children && children.length) {
        const edit = {
          parentId,
          children: children.map(this._addParentIds(nodeId)),
        };
        return Object.assign({}, node, edit);
      } else {
        const edit = { parentId };
        return Object.assign({}, node, edit);
      }
    };
  }

  /**
   * Get the nodeId of the first match for the specified selector.
   */
  async getNodeId(selector) {
    if (!this.document) {
      this.document = await this.getDocumentRoot();
    }

    const { nodeId } = await this._sendDebugCommand({
      method: 'DOM.querySelector',
      params: {
        selector,
        nodeId: this.document.nodeId,
      },
    });
    return nodeId;
  }

  /**
   * Get the DOM subtree for the node corresponding
   * to the given selector.
   * Takes a selector string or a nodeId number.
   */
  async getNode(what, offsetParent = false): Promise<Node> {
    const id = typeof what === 'number'
      ? what
      : await this.getNodeId(what);

    if (!this.document) {
      this.document = await this.getDocumentRoot();
    }

    /**
     * Search the cached document breadth-first for the
     * specified node. Optionally also search for the
     * offsetParent.
     *
     * wanted: Set<NodeId>
     *   stores the nodeIds we are looking for, but haven't found.
     *
     * found: Map<NodeId, Node>
     *   stores the Nodes we've found, associated with their nodeId.
     */
    const queue: Node[] = [ this.document ];
    const wanted: Set<NodeId> = new Set([ id ]);
    const found: { [NodeId]: Node } = {};

    // Optionally also search for the node's offsetParent.
    let offsetParentId: ?NodeId;  // Outer scope to permit access during search.

    if (offsetParent) {
      offsetParentId = await this.getOffsetParentId(id);
      wanted.add(offsetParentId);
    }

    while (queue.length > 0) {
      const node: Node = queue.shift();
      const { nodeId } = node;

      if (wanted.has(nodeId)) {
        found[nodeId] = node;
        wanted.delete(nodeId);
      }

      /**
       * If `wanted` is empty, we've found everything.
       * Attach the offsetParent to the main node, and
       * return the main node as the result.
       */
      if (wanted.size === 0) {
        let result: Node & { offsetParent: Node } = found[id];

        if (offsetParentId) {
          result.offsetParent = found[offsetParentId];
        }

        return result;
      }

      // Add children to the search queue.
      if (node.children) {
        queue.push(...node.children);
      }
    }

    /**
     * If search fails, return an Error object, which will be
     * checked by the caller and emitted back to the server.
     */
    throw new Error(`couldn't find node matching selector: ${what}`);
  }

  /**
   * Get computed and matched styles for the given node.
   */
  async getStyles(nodeId): Promise<*> {
    let node: Node;
    try {
      node = await this.getNode(nodeId);
    } catch (err) {
      throw err;
    }

    const { parentId } = node;

    const commands = [{
      method: 'CSS.getMatchedStylesForNode',
      params: { nodeId },
    }, {
      method: 'CSS.getComputedStyleForNode',
      params: { nodeId },
    }, {
      method: 'CSS.getComputedStyleForNode',
      params: { nodeId: parentId },
    }];

    const commandPromises =
      commands.map(this._sendDebugCommand.bind(this));
    const [ matchedStyles, ...computedStyles ] =
      await Promise.all(commandPromises);

    // Turn computed style arrays into ComputedStyleObjects.
    const toObject = (memo, current) => Object.assign(memo, {
      [current.name]: current.value,
    });
    const reduceToObject = arr => arr.reduce(toObject, {});
    const [ computedStyle, parentComputedStyle ] = computedStyles
      // Extract the computed styles array from the response object.
      .map(({ computedStyle }) => reduceToObject(computedStyle));

    return Object.assign({},
      matchedStyles,
      { computedStyle },
      { parentComputedStyle }
    );
  }

  /**
   * Get the nodeId of the given node's offsetParent.
   */
  async getOffsetParentId(nodeId: NodeId): Promise<NodeId> {
    // Set the node in question to the "currently"
    // "inspected" node, so we can use $0 in our
    // evaluation.
    await this._sendDebugCommand({
      method: 'DOM.setInspectedNode',
      params: { nodeId },
    });

    const { result } = await this._sendDebugCommand({
      method: 'Runtime.evaluate',
      params: {
        expression: '$0.parentNode',
        includeCommandLineAPI: true,
      },
    });

    const { objectId } = result;
    const offsetParentNode = await this._sendDebugCommand({
      method: 'DOM.requestNode',
      params: { objectId },
    });
    const offsetParentNodeId = offsetParentNode.nodeId;
    return offsetParentNodeId;
  }

  /**
   * Dispatch an incoming request from the socket
   * server.
   */
  async onRequest(req) {
    const responseTypes = {
      REQUEST_NODE: 'RECEIVE_NODE',
      REQUEST_STYLES: 'RECEIVE_STYLES',
    };

    const dispatch = {
      REQUEST_NODE: async ({ selector }) =>
        // Get offset parent
        ({ node: await this.getNode(selector, true) }),
      REQUEST_STYLES: ({ nodeId }) =>
        this.getStyles(nodeId),
      DEFAULT: ({ type }) =>
        new Error(`unrecognized request type ${type}`),
    };
    const action = dispatch[req.type] || dispatch['DEFAULT'];
    const result = await action(req);

    if (result instanceof Error) {
      this._socketEmit('data.err', {
        id: req.id,
        type: responseTypes[req.type],
        message: result.message,
      });
    } else {
      const responseType = responseTypes[req.type];
      const data = Object.assign({},
        req,
        result,
        { type: responseType }
      );
      this._socketEmit('data.res', data);
    }
  }

  /**
   * Handle certain events from the debugger.
   */
  _debugEventDispatch(target: Target, method: string, params: Object) {
    const dispatch = {
      /**
       * Fired when a node is inspected after calling DOM.setInspectMode.
       * Sets this.inspectedNode to the NodeId of the clicked element.
       */
      'DOM.inspectNodeRequested': async ({ backendNodeId }) => {
        // Disable inspection mode.
        window.endpoint._sendDebugCommand({
          method: 'DOM.setInspectMode',
          params: { mode: 'none' },
        });

        // Get the nodeId corresponding to the backendId.
        const { nodeIds } = await this._sendDebugCommand({
          method: 'DOM.pushNodesByBackendIdsToFrontend',
          params: {
            backendNodeIds: [backendNodeId],
          },
        });
        const [ inspectedNodeId ] = nodeIds;
        this.inspectedNode = await this.getNode(inspectedNodeId);

        // Send resulting node to server.
        this._socketEmit('data.update', {
          type: 'UPDATE_NODE',
          node: this.inspectedNode,
        });

        // Log to debug console.
        console.log(`Inspecting node ${inspectedNodeId}`, this.inspectedNode);
      },
    };

    const action = dispatch[method];

    if (action) {
      action(params);
    }
  };

  /**
   * Emit data over the socket.
   */
  _socketEmit(what: string, data: Object) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(what, data);
    } else {
      console.error(`No socket connection, couldn't emit message`, data);
    }
  }

  /**
   * Dispatch a command to the chrome.debugger API.
   */
  async _sendDebugCommand({ method, params }) {
    return await cp.debugger.sendCommand(this.target, method, params);
  }

  /**
   * Clean up socket connection and properties.
   */
  async cleanup() {
    if (this.socket && this.socket.connected) {
      this.socket.close();
    }
    if (this.target) {
      chrome.debugger.onEvent.removeListener(this._debugEventDispatch);
      await cp.debugger.detach(this.target);
    }
    if (window.endpoint) {
      delete window.endpoint;
    }
  }

  _onSocketDisconnect() {
    if (this.socket) {
      this.socket.off();
      this.socket = null;
    }
    console.log('Disconnected from socket');
    this.cleanup();
  }

  _onDebuggerDetach() {
    if (this.target) {
      this.target = null;
      this.document = null;
      console.log('Detached from debugging target');
    }
    this.cleanup();
  }
}

async function main() {
  if (!window.endpoint) {
    const endpoint = new BrowserEndpoint(SOCKET_PORT);
    window.endpoint = endpoint;
  }

  const tab = await BrowserEndpoint.getActiveTab();
  await window.endpoint.initConnections(tab.id);
  window.endpoint.selectNode();
}

chrome.browserAction.onClicked.addListener(main);
