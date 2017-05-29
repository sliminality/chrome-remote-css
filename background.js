// @flow
const cp = new ChromePromise();
const PROTOCOL = '1.2';

type Socket = Object;
type Target = {
  tabId: number,
};
type NodeId = number;

declare var io: (string, ?Object) => Socket;
declare var chrome: Object;

class BrowserEndpoint {
  socket: ?Socket;
  target: ?Target;
  document: ?Node;

  constructor(port) {
    this.socket = io(`http://localhost:${port}/browsers`, {
      autoConnect: false,
      reconnectionAttempts: 5,
    });
    this.target = null;
    this.document = null;
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
    chrome.debugger.onDetach.addListener(this._onDebuggerDetach.bind(this));
    console.log('Attached debugger to target', this.target);

    // Once debugger is mounted, get the DOM.
    this.document = await this._getDocumentRoot();
    console.log('Retrieved document root', this.document);

    if (this.socket) {
      // Once we have the DOM and are ready to handle
      // incoming requests, open the socket.
      await (new Promise(resolve => {
        if (this.socket) {
          this.socket.on('connect', resolve);
          this.socket.open();
        }
      }));

      this.socket.on('data.req', this.onRequest.bind(this));
      this.socket.on('disconnect', this._onSocketDisconnect.bind(this));

      console.log('Opened socket', this.socket);
    } else {
      console.error('No socket found, could not setup');
    }
  }

  /**
   * Set the root of the document.
   */
  async _getDocumentRoot() {
    const { root } = await this._sendDebugCommand({
      method: 'DOM.getDocument',
      params: { depth: -1 },
    });
    // Set parentId value on every node.
    const withParents = this._addParentIds(-1)(root);
    return withParents;
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
  async _getNodeId(selector) {
    if (!this.document) {
      this.document = await this._getDocumentRoot();
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
  async _getNode(what, offsetParent = false) {
    const id = typeof what === 'number'
      ? what
      : await this._getNodeId(what);

    if (!this.document) {
      this.document = await this._getDocumentRoot();
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

        return { node: result };
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
  async _getStyles(nodeId): Promise<*> {
    let node: Node & { offsetParent: Node };

    try {
      const result = await this._getNode(nodeId);
      node = result.node;
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
      REQUEST_NODE: ({ selector }) =>
        this._getNode(selector, true),  // Get offset parent
      REQUEST_STYLES: ({ nodeId }) =>
        this._getStyles(nodeId),
      DEFAULT: ({ type }) =>
        new Error(`unrecognized request type ${type}`),
    };
    const action = dispatch[req.type] || dispatch['DEFAULT'];
    const result = await action(req);

    if (result instanceof Error) {
      if (this.socket && this.socket.connected) {
        this.socket.emit('data.err', {
          id: req.id,
          type: responseTypes[req.type],
          message: result.message,
        });
      } else {
        console.error(`Request ${req.id} returned error, but no socket connection`);
        console.error(result);
      }
    } else {
      if (this.socket && this.socket.connected) {
        this.socket.emit(
          'data.res',
          Object.assign({}, req, result, { type: responseTypes[req.type] })
        );
      } else {
        console.log(`Request ${req.id} returned, but no socket connection`);
        console.log(result);
      }
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

const SOCKET_PORT = 1111;

async function main() {
  if (!window.endpoint) {
    const endpoint = new BrowserEndpoint(SOCKET_PORT);
    window.endpoint = endpoint;
  }

  const tab = await BrowserEndpoint.getActiveTab();
  await window.endpoint.initConnections(tab.id);
}

chrome.browserAction.onClicked.addListener(main);
