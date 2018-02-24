// @flow
import ChromePromise from 'chrome-promise';
import io from 'socket.io-client';
import config from './_config';

const cp = new ChromePromise();

type TargetInfo = {
  type: 'page' | 'background_page' | 'worker' | 'other',
  id: string,
  tabId?: number, // Defined if type === 'page'.
  attached: boolean,
  title: string,
  url: string,
};

async function getActiveTab(): Promise<TargetInfo> {
  const tabs = await cp.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (tabs.length === 0) {
    return null;
  }
  return tabs[0];
}

// debugger stuff
