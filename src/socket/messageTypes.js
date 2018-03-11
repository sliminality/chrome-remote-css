// @flow @format

// TODO: ply/shared

const socketio = {
  connect: 'connect',
  disconnect: 'disconnect',
  reconnect: 'reconnect',
  reconnect_attempt: 'reconnect_attempt',
  reconnect_failed: 'reconnect_failed',
};
const serverToClient = {
  // Server -> Client
  TARGET_CONNECTED: 'TARGET_CONNECTED',
  TARGET_DISCONNECTED: 'TARGET_DISCONNECTED',
  ERROR: 'ERROR',
  PRUNE_NODE_RESULT: 'PRUNE_NODE_RESULT',
  COMPUTE_DEPENDENCIES_RESULT: 'COMPUTE_DEPENDENCIES_RESULT',
  SET_DOCUMENT: 'SET_DOCUMENT',
  SET_STYLES: 'SET_STYLES',
  SET_INSPECTION_ROOT: 'SET_INSPECTION_ROOT',
};
const clientToServer = {
  // Dispatched to store AND pushed to server
  PRUNE_NODE: 'PRUNE_NODE',
  COMPUTE_DEPENDENCIES: 'COMPUTE_DEPENDENCIES',

  // Pushed to server only
  CLEAR_HIGHLIGHT: 'CLEAR_HIGHLIGHT',
  HIGHLIGHT_NODE: 'HIGHLIGHT_NODE',
  REQUEST_STYLE_FOR_NODE: 'REQUEST_STYLE_FOR_NODE',
  TOGGLE_CSS_PROPERTY: 'TOGGLE_CSS_PROPERTY',
};

export { socketio, serverToClient, clientToServer };
