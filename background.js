const port = 8090;
let connected = false;
let target = null;
let root = null;
let selector = 'body > main > section:nth-child(3) > div:nth-child(2) > figure';

/**
 * Socket connection
 */

const socket = io.connect(`http://localhost:${port}`);

socket.on('connect', () => {
  log('connected to socket');
  connected = true;
});

socket.on('requestNode', ({ selector }) => {
  log(`node requested: ${selector}`);
});

socket.on('chromeGetNode', ({ selector }) => {
  log(`chrome node requested`);
});

socket.on('disconnect', () => {
  connected = false;
  log('disconnected from socket server');
});

/**
 * Chrome debugger functions
 */

const cp = new ChromePromise();

const getActiveTab = () => co(function* () {
  const tabs = yield cp.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (tabs.length === 0) {
    return new Error('getActiveTab: no active tab found');
  }

  return tabs[0];
});

const attachDebugger = tab => co(function* () {
  target = { tabId: tab.id };
  const protocol = '1.2';
  yield cp.debugger.attach(target, protocol);
  log(`Attached debugger to tab ${target.tabId}`);
});

const getRootNode = () => co(function* () {
  /**
   * Can't use `sendDebugCommand` for this one because
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

const sendDebugCommand = (method, params) => co(function* () {
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
  const res = yield sendDebugCommand('DOM.querySelector', {
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
  sendDebugCommand('CSS.getMatchedStylesForNode', {
    nodeId
  });

const log = data => console.log(data);

function main() {
  getActiveTab()
    .then(attachDebugger)
    .then(getRootNode)
    .then(log)
    .catch(log);
}

chrome.browserAction.onClicked.addListener(main);
