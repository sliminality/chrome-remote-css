// function getCurrentTabUrl(callback) {
//   // Query filter to be passed to chrome.tabs.query - see
//   // https://developer.chrome.com/extensions/tabs#method-query
//   var queryInfo = {
//     active: true,
//     currentWindow: true
//   };

//   chrome.tabs.query(queryInfo, function(tabs) {
//     // chrome.tabs.query invokes the callback with a list of tabs that match the
//     // query. When the popup is opened, there is certainly a window and at least
//     // one tab, so we can safely assume that |tabs| is a non-empty array.
//     // A window can only have one active tab at a time, so the array consists of
//     // exactly one tab.
//     var tab = tabs[0];

//     // A tab is a plain object that provides information about the tab.
//     // See https://developer.chrome.com/extensions/tabs#type-Tab
//     var url = tab.url;

//     // tab.url is only available if the "activeTab" permission is declared.
//     // If you want to see the URL of other tabs (e.g. after removing active:true
//     // from |queryInfo|), then the "tabs" permission is required to see their
//     // "url" properties.
//     console.assert(typeof url == 'string', 'tab.url should be a string');

//     callback(url);
//   });

//   // Most methods of the Chrome extension APIs are asynchronous. This means that
//   // you CANNOT do something like this:
//   //
//   // var url;
//   // chrome.tabs.query(queryInfo, function(tabs) {
//   //   url = tabs[0].url;
//   // });
//   // alert(url); // Shows "undefined", because chrome.tabs.query is async.
// }

// function getImageUrl(searchTerm, callback, errorCallback) {
//   // Google image search - 100 searches per day.
//   // https://developers.google.com/image-search/
//   var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
//     '?v=1.0&q=' + encodeURIComponent(searchTerm);
//   var x = new XMLHttpRequest();
//   x.open('GET', searchUrl);
//   // The Google image search API responds with JSON, so let Chrome parse it.
//   x.responseType = 'json';
//   x.onload = function() {
//     // Parse and process the response from Google Image Search.
//     var response = x.response;
//     if (!response || !response.responseData || !response.responseData.results ||
//         response.responseData.results.length === 0) {
//       errorCallback('No response from Google Image search!');
//       return;
//     }
//     var firstResult = response.responseData.results[0];
//     // Take the thumbnail instead of the full image to get an approximately
//     // consistent image size.
//     var imageUrl = firstResult.tbUrl;
//     var width = parseInt(firstResult.tbWidth);
//     var height = parseInt(firstResult.tbHeight);
//     console.assert(
//         typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
//         'Unexpected respose from the Google Image Search API!');
//     callback(imageUrl, width, height);
//   };
//   x.onerror = function() {
//     errorCallback('Network error.');
//   };
//   x.send();
// }

// function renderStatus(statusText) {
//   document.getElementById('status').textContent = statusText;
// }

// const socket = new WebSocket('ws://localhost:5400');

// socket.addEventListener('open', (evt) => {
//   socket.send('Hello Server!');
// });

// socket.addEventListener('message', (evt) => {
//   console.log('Message from server', evt.data);
// });

const port = 8090;
let connected = false;
let target = null;
let root = null;
let selector = 'body > main > section:nth-child(3) > div:nth-child(2) > figure';
let el = null;

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
  // Attach target to global namespace.
  target = { tabId: tab.id };
  const protocol = '1.2';
  yield cp.debugger.attach(target, protocol);
  log(`Attached debugger to tab ${target.tabId}`);
});

const getRootNode = () => co(function* () {
  if (!target) {
    return new Error('getRootNode: no target defined');
  }
  const command = {
    target,
    method: 'DOM.getDocument',
    commandParams: {
      depth: -1,  // -1 gets all children recursively
    },
  };
  const res = yield cp.debugger.sendCommand(
    command.target,
    command.method,
    command.commandParams
  );

  if (!res) {
    return new Error('getRootNode:', chrome.runtime.lastError);
  }

  root = res.root;
  socket.emit('got nodes', { root });
  return root;
});

const getNodeId = selector => co(function* () {
  if (!target) {
    return new Error('queryNode: no target defined');
  }

  // Get root node if necessary.
  if (!root) {
    yield getRootNode();
  }

  const command = {
    target,
    method: 'DOM.querySelector',
    commandParams: {
      nodeId: root.nodeId,
      selector,
    },
  };

  const res = yield cp.debugger.sendCommand(
    command.target,
    command.method,
    command.commandParams
  );

  if (!res) {
    return new Error('getRootNode:', chrome.runtime.lastError);
  }

  const { nodeId } = res;
  return nodeId;
});

const getNode = selector => co(function* () {
  if (!target) {
    return new Error('getNode: no target defined');
  }
  // Get root node if necessary.
  if (!root) {
    yield getRootNode();
  }

  // BFS for Node object corresponding to the given nodeId.
  const id = yield getNodeId(selector);
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

const sendDebugCommand = (method, params) => co(function* () {
  if (!target) {
    return new Error(method, ': no target defined');
  }

  const res = yield cp.debugger.sendCommand(target, method, params);

  if (!res) {
    return new Error(method, ':', chrome.runtime.lastError);
  }
  return res;
});

const log = data => console.log(data);

function main() {
  getActiveTab()
    .then(attachDebugger)
    .then(log)
    .catch(log);
}

chrome.browserAction.onClicked.addListener(main);
