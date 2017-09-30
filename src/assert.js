// @flow

// TODO(slim): Eventually check for dev vs. prod environment.

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export default assert;
