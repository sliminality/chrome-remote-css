// @flow

/**
 * Functions for interacting with the Chrome Tabs API.
 */

declare var chrome: Object;

type Tab = {
  id?: number,
  index: number,
  windowId: number,
  openerTabId?: number,
  highlighted: boolean,
  active: boolean,
  pinned: boolean,
  audible: boolean,
  discarded: boolean,
  url?: string,
  title?: string,
  status?: 'loading' | 'complete',
  incognito: boolean,
  width?: number,
  height?: number,
  sessionId?: string,
};

function createTab(url?: string, cb?: Tab => void) {
  chrome.tabs.create({ url }, cb);
}

export { createTab };
