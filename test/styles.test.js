// @flow @format
import test from 'ava';
import { buildCSS } from './helpers/styleHelpers';

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
