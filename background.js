/**
 * Chrome debugger functions
 */
let target = null;
let root = null;
let selector = 'body > main > section:nth-child(3) > div:nth-child(2) > figure';

const cp = new ChromePromise();

const _getActiveTab = () => co(function* () {
  const tabs = yield cp.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (tabs.length === 0) {
    return new Error('_getActiveTab: no active tab found');
  }

  return tabs[0];
});

const _attachDebugger = tab => co(function* () {
  target = { tabId: tab.id };
  const protocol = '1.2';
  yield cp.debugger.attach(target, protocol);
  log(`Attached debugger to tab ${target.tabId}`);
});

const _detachDebugger = () => {
  if (!target) {
    return new Error('_detachDebugger: no debugger to detach');
  }
  cp.debugger.detach(target);
  log(`Detached from target ${target.tabId}`);
  target = null;
  root = null;
};

const getRootNode = () => co(function* () {
  /**
   * Can't use `_sendDebugCommand` for this one because
   * it would cause a mutually recursive infinite loop.
   */
  if (!target) {
    return new Error(method, ': no target defined');
  }

  const res = yield cp.debugger.sendCommand(
    target,
    'DOM.getDocument',
    { depth: -1 }
  );
  root = res.root;
  return root;
});

const _sendDebugCommand = (method, params) => co(function* () {
  if (!target) {
    return new Error(method, ': no target defined');
  }
  if (!root) {
    return new Error(method, ': no document root defined');
  }

  const res = yield cp.debugger.sendCommand(target, method, params);

  if (!res) {
    return new Error(method, ':', chrome.runtime.lastError);
  }
  return res;
});

const _getNodeId = selector => co(function* () {
  const res = yield _sendDebugCommand('DOM.querySelector', {
    nodeId: root.nodeId,
    selector,
  });
  return res.nodeId;
});

const getNode = selector => co(function* () {
  // BFS for Node object corresponding to the given nodeId.
  const id = yield _getNodeId(selector);
  const queue = [ root ];
  let node = null;

  while (queue.length > 0) {
    const current = queue.shift();
    if (current.nodeId === id) {
      node = current;
      break;
    }
    if (current.children) {
      for (const c of current.children) {
        queue.push(c);
      }
    }
  }

  if (!node) {
    return new Error('getNode: node not found');
  }
  return node;
});

const getNodeMatchedStyles = nodeId =>
  _sendDebugCommand('CSS.getMatchedStylesForNode', {
    nodeId
  });

const onDebuggerDetach = (source, reason) => {
  target = null;
  root = null;
  log(`Detached from target ${source}: ${reason}`);
};

const log = data => console.log(data);

const toggleDebugger = () => co(function* () {
  if (target) {
    _detachDebugger();
  } else {
    try {
      const tab = yield _getActiveTab();
      yield _attachDebugger(tab);
      yield getRootNode();
    } catch (err) {
      log(err);
    }
  }
});

chrome.browserAction.onClicked.addListener(toggleDebugger);
chrome.debugger.onDetach.addListener(onDebuggerDetach);

/**
 * Socket connection
 */
const port = 8090;
let connected = false;

const socket = io.connect(`http://localhost:${port}`);

socket.on('connect', () => {
  connected = true;
  log(`Connected to socket: ${socket.id}`);
});

socket.on('disconnect', () => {
  connected = false;
  log('Disconnected from socket');
});

socket.on('data.request.DOM', ({ id, selector }) => {
  log(`Node requested: ${selector}`);
  getNode(selector)
    .then(node => socket.emit('data.response.DOM', {
      id,
      node,
    }))
    .catch(err => socket.emit('data.response.error', {
      id,
      message: err,
    }));
});

socket.on('data.request.styles', ({ id, nodeId }) => {
  log(`Styles requested for node: ${nodeId}`);
  getNodeMatchedStyles(nodeId)
    .then(styles => socket.emit('data.response.styles', {
      id,
      styles,
    }))
    .catch(err => socket.emit('data.response.styles', {
      id,
      message: err,
    }));
});
