// @flow @format

/**
 * Testing utilities for CSS domain functions.
 */

import type { CRDP$CSSProperty } from 'devtools-typed/CSS';

export type MockCSSRuleMatch = {
  rule: {
    style: {
      cssProperties: Array<CRDP$CSSProperty>,
    },
  },
};

export type CSSInput = {
  [selector: string]: {
    [name: string]: string,
  },
};

export function buildCSS(input: CSSInput): Array<MockCSSRuleMatch> {
  const result = [];

  for (const selector in input) {
    const style = input[selector];
    const cssProperties = [];

    for (const name in style) {
      const value = style[name];
      const property = {
        name,
        value,
      };

      if (value.lastIndexOf('!important') !== -1) {
        // $FlowFixMe - just for testing
        property.important = true;
      }

      // A leading `//` signifies the property is disabled.
      if (value.substring(0, 2) === '//') {
        // $FlowFixMe - also just for testing
        property.disabled = true;
      }

      cssProperties.push(property);
    }

    const ruleMatch = { rule: { style: { cssProperties } } };
    result.push(ruleMatch);
  }

  return result;
}
