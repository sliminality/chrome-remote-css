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

export { showImage };
