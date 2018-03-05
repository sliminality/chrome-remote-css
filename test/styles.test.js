// @flow @format
import test from 'ava';
import { buildCSS } from './helpers/styleHelpers';
import { getEffectiveValueForProperty } from '../src/styles';

import type { CRDP$CSSProperty } from 'devtools-typed/CSS';
import type { MockCSSRuleMatch, CSSInput } from './helpers/styleHelpers';

test('build CSS from example', t => {
  const input = {
    '.foo': {
      margin: '10px',
      'margin-top': '20px',
      'margin-right': '20px',
      'margin-bottom': '20px !important',
      'margin-left': '20px',
    },
    '.bar': {
      margin: '30px',
    },
  };

  const expected = [
    {
      rule: {
        style: {
          cssProperties: [
            { name: 'margin', value: '10px' },
            { name: 'margin-top', value: '20px' },
            { name: 'margin-right', value: '20px' },
            {
              name: 'margin-bottom',
              value: '20px !important',
              important: true,
            },
            { name: 'margin-left', value: '20px' },
          ],
        },
      },
    },
    {
      rule: {
        style: {
          cssProperties: [{ name: 'margin', value: '30px' }],
        },
      },
    },
  ];

  t.deepEqual(buildCSS(input), expected);
});

test('find effective property with !important', t => {
  const input = [
    {
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 6,
                endLine: 22,
                startColumn: 0,
                startLine: 22,
              },
              text: '.front',
            },
          ],
          text: '.front',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'position',
              range: {
                endColumn: 29,
                endLine: 23,
                startColumn: 4,
                startLine: 23,
              },
              text: '/* position: absolute; */',
              value: 'absolute',
            },
          ],
          cssText: '\n    /* position: absolute; */\n',
          range: {
            endColumn: 0,
            endLine: 24,
            startColumn: 8,
            startLine: 22,
          },
          shorthandEntries: [],
          styleSheetId: '25533.28',
        },
        styleSheetId: '25533.28',
      },
    },
    {
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 6,
                endLine: 16,
                startColumn: 0,
                startLine: 16,
              },
              text: '.front',
            },
          ],
          text: '.front',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              implicit: false,
              important: true,
              name: 'position',
              range: {
                endColumn: 34,
                endLine: 17,
                startColumn: 4,
                startLine: 17,
              },
              text: 'position: relative !important;',
              value: 'relative !important',
            },
            {
              disabled: false,
              implicit: false,
              name: 'top',
              range: {
                endColumn: 14,
                endLine: 18,
                startColumn: 4,
                startLine: 18,
              },
              text: 'top: 25px;',
              value: '25px',
            },
            {
              disabled: false,
              implicit: false,
              name: 'left',
              range: {
                endColumn: 15,
                endLine: 19,
                startColumn: 4,
                startLine: 19,
              },
              text: 'left: 25px;',
              value: '25px',
            },
          ],
          cssText:
            '\n    position: relative !important;\n    top: 25px;\n    left: 25px;\n',
          range: {
            endColumn: 0,
            endLine: 20,
            startColumn: 8,
            startLine: 16,
          },
          shorthandEntries: [],
          styleSheetId: '25533.28',
        },
        styleSheetId: '25533.28',
      },
    },
    {
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 6,
                endLine: 12,
                startColumn: 0,
                startLine: 12,
              },
              text: '.front',
            },
          ],
          text: '.front',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'position',
              range: {
                endColumn: 26,
                endLine: 13,
                startColumn: 4,
                startLine: 13,
              },
              text: '/* position: fixed; */',
              value: 'fixed',
            },
          ],
          cssText: '\n    /* position: fixed; */\n',
          range: {
            endColumn: 0,
            endLine: 14,
            startColumn: 8,
            startLine: 12,
          },
          shorthandEntries: [],
          styleSheetId: '25533.28',
        },
        styleSheetId: '25533.28',
      },
    },
    {
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 6,
                endLine: 0,
                startColumn: 0,
                startLine: 0,
              },
              text: '.front',
            },
          ],
          text: '.front',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              implicit: false,
              name: 'background-color',
              range: {
                endColumn: 26,
                endLine: 1,
                startColumn: 4,
                startLine: 1,
              },
              text: 'background-color: red;',
              value: 'red',
            },
            {
              disabled: false,
              implicit: false,
              name: 'height',
              range: {
                endColumn: 18,
                endLine: 2,
                startColumn: 4,
                startLine: 2,
              },
              text: 'height: 150px;',
              value: '150px',
            },
            {
              disabled: false,
              implicit: false,
              name: 'width',
              range: {
                endColumn: 16,
                endLine: 3,
                startColumn: 4,
                startLine: 3,
              },
              text: 'width: 60px;',
              value: '60px',
            },
          ],
          cssText:
            '\n    background-color: red;\n    height: 150px;\n    width: 60px;\n',
          range: {
            endColumn: 0,
            endLine: 4,
            startColumn: 8,
            startLine: 0,
          },
          shorthandEntries: [],
          styleSheetId: '25533.28',
        },
        styleSheetId: '25533.28',
      },
    },
    {
      rule: {
        media: [],
        origin: 'user-agent',
        selectorList: {
          selectors: [
            {
              text: 'div',
            },
          ],
          text: 'div',
        },
        style: {
          cssProperties: [
            {
              name: 'display',
              value: 'block',
            },
          ],
          shorthandEntries: [],
        },
      },
    },
  ];

  const values = getEffectiveValueForProperty(input)('position').map(
    ({ value }) => value,
  );

  t.deepEqual(values, ['relative !important']);
});

test('find effective property with shorthands', t => {
  const input = [
    {
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 6,
                endLine: 4,
                startColumn: 0,
                startLine: 4,
              },
              text: '.front',
            },
          ],
          text: '.front',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              implicit: false,
              name: 'margin-left',
              range: {
                endColumn: 22,
                endLine: 5,
                startColumn: 4,
                startLine: 5,
              },
              text: 'margin-left: 40px;',
              value: '40px',
            },
            {
              disabled: false,
              implicit: false,
              name: 'margin-right',
              range: {
                endColumn: 23,
                endLine: 6,
                startColumn: 4,
                startLine: 6,
              },
              text: 'margin-right: 40px;',
              value: '40px',
            },
          ],
          cssText: '\n    margin-left: 40px;\n    margin-right: 40px;\n',
          range: {
            endColumn: 0,
            endLine: 7,
            startColumn: 8,
            startLine: 4,
          },
          shorthandEntries: [],
          styleSheetId: '25533.39',
        },
        styleSheetId: '25533.39',
      },
    },
    {
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 6,
                endLine: 0,
                startColumn: 0,
                startLine: 0,
              },
              text: '.front',
            },
          ],
          text: '.front',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'margin',
              range: {
                endColumn: 25,
                endLine: 1,
                startColumn: 4,
                startLine: 1,
              },
              text: '/* margin: 0 20px; */',
              value: '0 20px',
            },
          ],
          cssText: '\n    /* margin: 0 20px; */\n',
          range: {
            endColumn: 0,
            endLine: 2,
            startColumn: 8,
            startLine: 0,
          },
          shorthandEntries: [],
          styleSheetId: '25533.39',
        },
        styleSheetId: '25533.39',
      },
    },
    {
      rule: {
        media: [],
        origin: 'user-agent',
        selectorList: {
          selectors: [
            {
              text: 'div',
            },
          ],
          text: 'div',
        },
        style: {
          cssProperties: [
            {
              name: 'display',
              value: 'block',
            },
          ],
          shorthandEntries: [],
        },
      },
    },
  ];

  const values = getEffectiveValueForProperty(input)('margin').map(
    ({ value }) => value,
  );
  t.deepEqual(values, ['40px', '40px']);
});
