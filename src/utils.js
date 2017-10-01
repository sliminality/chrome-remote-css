// @flow
import { createTab } from './tabs';
import { prefixURI } from './pdiff';

import type { Base64String } from './pdiff';

/**
 * Various utils for development and debugging.
 */

function showImage(b64: Base64String) {
  const uri = prefixURI(b64);
  createTab(uri);
}

function assert(condition: boolean, message: string) {
  // TODO(slim): Eventually check for dev vs. prod environment.
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export { showImage, assert };
