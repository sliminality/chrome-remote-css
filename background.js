const cp = new ChromePromise();

class BrowserEndpoint {
  constructor(port) {
    this.socket = io(`http://localhost:${port}/browsers`, {
      autoConnect: false,
      reconnectionAttempts: 5,
    });
    this.target = null;
    this.document = null;
  }

  /**
   * Prepare to receive requests for debugger data.
   */
  async initConnections(tabId) {
    // Mount debugger.
    const protocol = '1.2';
    await cp.debugger.attach({ tabId }, protocol);

    this.target = { tabId };
    chrome.debugger.onDetach.addListener(this._onDebuggerDetach.bind(this));
    console.log('Attached debugger to target', this.target);

    // Once debugger is mounted, get the DOM.
    this.document = await this._getDocumentRoot();
    console.log('Retrieved document root', this.document);

    // Once we have the DOM and are ready to handle
    // incoming requests, open the socket.
    const openSocket = () => new Promise(resolve => {
      this.socket.on('connect', resolve);
      this.socket.open();
    });
    await openSocket();
    this.socket.on('data.req', this.onRequest.bind(this));
    this.socket.on('disconnect', this._onSocketDisconnect.bind(this));
    console.log('Opened socket', this.socket);
  }

  /**
   * Set the root of the document.
   */
  async _getDocumentRoot() {
    const { root } = await this._sendDebugCommand({
      method: 'DOM.getDocument',
      params: { depth: -1 },
    });
    return root;
  }

  /**
   * Get the nodeId of the first match for the specified selector.
   */
  async _getNodeId(selector) {
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
   */
  async _getNode(selector) {
    // First, we need to get the nodeId of the desired node.
    const id = await this._getNodeId(selector);

    // Then we search the document for the corresponding Node object.
    const q = [ this.document ];

    while (q.length > 0) {
      const node = q.shift();
      if (node.nodeId === id) {
        return { node };
      }
      if (node.children) {
        q.push(...node.children);
      }
    }

    // If it fails, return an Error object, which
    // will be checked by the caller and emitted.
    return new Error(`couldn't find node matching selector: ${selector}`);
  }

  /**
   * Get computed and matched styles for the given node.
   */
  async _getStyles(nodeId) {
    const matchedStylesCmd = {
      method: 'CSS.getMatchedStylesForNode',
      params: { nodeId },
    };
    const compStylesCmd = {
      method: 'CSS.getComputedStyleForNode',
      params: { nodeId },
    };
    const [ matchedStyles, compStyles ] = await Promise.all([
      this._sendDebugCommand(matchedStylesCmd),
      this._sendDebugCommand(compStylesCmd),
    ]);
    const { computedStyle } = compStyles;
    // Turn computedStyle into an object like a civilized human.
    const cs = computedStyle.reduce(
      (memo, current) => Object.assign(memo, {
        [current.name]: current.value,
      }), {});

    return Object.assign({},
      matchedStyles,
      { computedStyle: cs }
    );
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
        this._getNode(selector),
      REQUEST_STYLES: ({ nodeId }) =>
        this._getStyles(nodeId),
      DEFAULT: ({ type }) =>
        new Error(`unrecognized request type ${type}`),
    };

    const action = dispatch[req.type] || dispatch['DEFAULT'];
    const result = await action(req);

    if (result instanceof Error) {
      this.socket.emit('data.err', {
        id: req.id,
        type: responseTypes[req.type],
        message: result.message,
      });
    } else {
      this.socket.emit('data.res', Object.assign({},
        req,
        result,
        { type: responseTypes[req.type] }
      ));
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
    this.socket.off();
    this.socket = null;
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

async function getActiveTab() {
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

const SOCKET_PORT = 1111;

async function main() {
  if (!window.endpoint) {
    const endpoint = new BrowserEndpoint(SOCKET_PORT);
    window.endpoint = endpoint;
  }

  const tab = await getActiveTab();
  await window.endpoint.initConnections(tab.id);
}

chrome.browserAction.onClicked.addListener(main);
