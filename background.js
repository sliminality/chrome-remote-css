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
    throw new Error('_getActiveTab: no active tab found');
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
    throw new Error('_detachDebugger: no debugger to detach');
  }
  chrome.debugger.detach(target);

  // If we detach ourselves, `onDebuggerDetach` won't get called.
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
    throw new Error(method, ': no target defined');
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
    throw new Error(method, ': no target defined');
  }
  if (!root) {
    throw new Error(method, ': no document root defined');
  }

  const res = yield cp.debugger.sendCommand(target, method, params);

  if (!res) {
    throw new Error(method, ':', chrome.runtime.lastError);
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
    throw new Error('getNode: node not found');
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

const log = (...data) => console.log(...data);

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

/**
 * Socket connection
 */
const port = 8090;
const socket = io(`http://localhost:${port}`, {
  autoConnect: false,
});
let connected = false;

socket.on('connect', () => {
  connected = true;
  log(`Connected to socket: ${socket.id}`);
});

socket.on('disconnect', () => {
  connected = false;
  log('Disconnected from socket');
});

socket.on('server.request.node', ({ id, selector }) =>
  onServerRequest({
    id,
    fn: getNode,
    what: 'node',
    who: selector,
  }));

socket.on('server.request.styles', ({ id, nodeId }) =>
  onServerRequest({
    id,
    fn: getNodeMatchedStyles,
    what: 'styles',
    who: nodeId,
  }));

const onServerRequest = ({ id, fn, what, who }) => co(function* () {
  console.group(id);
  log('Server requested', what, 'for', who);
  let result;
  try {
    result = yield fn(who);
    socket.emit(`ext.response.${what}`, {
      id,
      [what]: result,
    });
    log('Returned', what, 'for', who);
  } catch (err) {
    log(err);
    socket.emit('ext.response.error', {
      id,
      name: err.name,
      message: err.message,
    });
  }
  console.groupEnd();
});

const toggleSocket = () => {
  if (!connected) {
    socket.connect();
  } else {
    socket.disconnect();
  }
};

/**
 * Initialize stuff
 */
const start = () => {
  toggleDebugger();
  toggleSocket();
};

chrome.browserAction.onClicked.addListener(start);
chrome.debugger.onDetach.addListener(onDebuggerDetach);
