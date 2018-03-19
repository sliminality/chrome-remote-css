// @flow @format
import test from 'ava';
import { buildCSS } from './helpers/styleHelpers';
import {
  getEffectiveValueForProperty,
  createStyleMask,
  diffStyleMasks,
  isPropertyActive,
} from '../src/styles';

test('create style mask', t => {
  const input = [
    {
      matchingSelectors: [0],
      rule: {
        media: [
          {
            mediaList: [
              {
                active: true,
                expressions: [
                  {
                    computedLength: 734,
                    feature: 'min-width',
                    unit: 'px',
                    value: 734,
                  },
                ],
              },
            ],
            range: {
              endColumn: 35,
              endLine: 2967,
              startColumn: 7,
              startLine: 2967,
            },
            source: 'mediaRule',
            sourceURL: 'http://localhost:7999/oscar/index_files/bundle.css',
            styleSheetId: '75164.19',
            text: 'screen and (min-width: 734px)',
          },
        ],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 49,
                endLine: 2968,
                startColumn: 4,
                startLine: 2968,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              implicit: false,
              name: 'height',
              range: {
                endColumn: 4,
                endLine: 2970,
                startColumn: 8,
                startLine: 2969,
              },
              text: 'height: 10rem\n    ',
              value: '10rem',
            },
          ],
          cssText: '\n        height: 10rem\n    ',
          range: {
            endColumn: 4,
            endLine: 2970,
            startColumn: 51,
            startLine: 2968,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 45,
                endLine: 2962,
                startColumn: 0,
                startLine: 2962,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'color',
              range: {
                endColumn: 22,
                endLine: 2963,
                startColumn: 4,
                startLine: 2963,
              },
              text: '/* color: #fff; */',
              value: '#fff',
            },
            {
              disabled: false,
              implicit: false,
              name: 'height',
              range: {
                endColumn: 0,
                endLine: 2965,
                startColumn: 4,
                startLine: 2964,
              },
              text: 'height: 7rem\n',
              value: '7rem',
            },
          ],
          cssText: '\n    /* color: #fff; */\n    height: 7rem\n',
          range: {
            endColumn: 0,
            endLine: 2965,
            startColumn: 47,
            startLine: 2962,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [4],
      rule: {
        media: [
          {
            mediaList: [
              {
                active: true,
                expressions: [
                  {
                    computedLength: 734,
                    feature: 'min-width',
                    unit: 'px',
                    value: 734,
                  },
                ],
              },
            ],
            range: {
              endColumn: 35,
              endLine: 2940,
              startColumn: 7,
              startLine: 2940,
            },
            source: 'mediaRule',
            sourceURL: 'http://localhost:7999/oscar/index_files/bundle.css',
            styleSheetId: '75164.19',
            text: 'screen and (min-width: 734px)',
          },
        ],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 46,
                endLine: 2941,
                startColumn: 4,
                startLine: 2941,
              },
              text: '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS',
            },
            {
              range: {
                endColumn: 88,
                endLine: 2941,
                startColumn: 47,
                startLine: 2941,
              },
              text: '.navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP',
            },
            {
              range: {
                endColumn: 126,
                endLine: 2941,
                startColumn: 89,
                startLine: 2941,
              },
              text: '.navHeaderShort-eXOoccIdsiS38H7RjPxao',
            },
            {
              range: {
                endColumn: 167,
                endLine: 2941,
                startColumn: 127,
                startLine: 2941,
              },
              text: '.navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5',
            },
            {
              range: {
                endColumn: 213,
                endLine: 2941,
                startColumn: 168,
                startLine: 2941,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text:
            '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS, .navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP, .navHeaderShort-eXOoccIdsiS38H7RjPxao, .navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5, .navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'box-shadow',
              range: {
                endColumn: 31,
                endLine: 2942,
                startColumn: 8,
                startLine: 2942,
              },
              text: '/* box-shadow: none; */',
              value: 'none',
            },
            {
              disabled: true,
              name: 'height',
              range: {
                endColumn: 28,
                endLine: 2943,
                startColumn: 8,
                startLine: 2943,
              },
              text: '/* height: 10rem; */',
              value: '10rem',
            },
            {
              disabled: true,
              name: 'overflow',
              range: {
                endColumn: 31,
                endLine: 2944,
                startColumn: 8,
                startLine: 2944,
              },
              text: '/* overflow: visible */',
              value: 'visible',
            },
          ],
          cssText:
            '\n        /* box-shadow: none; */\n        /* height: 10rem; */\n        /* overflow: visible */\n    ',
          range: {
            endColumn: 4,
            endLine: 2945,
            startColumn: 215,
            startLine: 2941,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [4],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 42,
                endLine: 2929,
                startColumn: 0,
                startLine: 2929,
              },
              text: '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS',
            },
            {
              range: {
                endColumn: 84,
                endLine: 2929,
                startColumn: 43,
                startLine: 2929,
              },
              text: '.navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP',
            },
            {
              range: {
                endColumn: 122,
                endLine: 2929,
                startColumn: 85,
                startLine: 2929,
              },
              text: '.navHeaderShort-eXOoccIdsiS38H7RjPxao',
            },
            {
              range: {
                endColumn: 163,
                endLine: 2929,
                startColumn: 123,
                startLine: 2929,
              },
              text: '.navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5',
            },
            {
              range: {
                endColumn: 209,
                endLine: 2929,
                startColumn: 164,
                startLine: 2929,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text:
            '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS, .navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP, .navHeaderShort-eXOoccIdsiS38H7RjPxao, .navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5, .navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'color',
              range: {
                endColumn: 25,
                endLine: 2930,
                startColumn: 4,
                startLine: 2930,
              },
              text: '/* color: #001837; */',
              value: '#001837',
            },
            {
              disabled: true,
              name: 'height',
              range: {
                endColumn: 23,
                endLine: 2931,
                startColumn: 4,
                startLine: 2931,
              },
              text: '/* height: 7rem; */',
              value: '7rem',
            },
            {
              disabled: true,
              name: 'left',
              range: {
                endColumn: 18,
                endLine: 2932,
                startColumn: 4,
                startLine: 2932,
              },
              text: '/* left: 0; */',
              value: '0',
            },
            {
              disabled: false,
              implicit: false,
              name: 'position',
              range: {
                endColumn: 20,
                endLine: 2933,
                startColumn: 4,
                startLine: 2933,
              },
              text: 'position: fixed;',
              value: 'fixed',
            },
            {
              disabled: false,
              implicit: false,
              name: 'top',
              range: {
                endColumn: 11,
                endLine: 2934,
                startColumn: 4,
                startLine: 2934,
              },
              text: 'top: 0;',
              value: '0',
            },
            {
              disabled: false,
              implicit: false,
              name: 'transition',
              range: {
                endColumn: 93,
                endLine: 2935,
                startColumn: 4,
                startLine: 2935,
              },
              text:
                'transition: background-color .25s cubic-bezier(1,0,0,1),color .25s cubic-bezier(1,0,0,1);',
              value:
                'background-color .25s cubic-bezier(1,0,0,1),color .25s cubic-bezier(1,0,0,1)',
            },
            {
              disabled: false,
              implicit: false,
              name: 'width',
              range: {
                endColumn: 16,
                endLine: 2936,
                startColumn: 4,
                startLine: 2936,
              },
              text: 'width: 100%;',
              value: '100%',
            },
            {
              disabled: false,
              implicit: false,
              name: 'z-index',
              range: {
                endColumn: 0,
                endLine: 2938,
                startColumn: 4,
                startLine: 2937,
              },
              text: 'z-index: 300\n',
              value: '300',
            },
            {
              name: 'transition-duration',
              value: '0.25s, 0.25s',
            },
            {
              name: 'transition-timing-function',
              value: 'cubic-bezier(1, 0, 0, 1), cubic-bezier(1, 0, 0, 1)',
            },
            {
              name: 'transition-delay',
              value: 'initial, initial',
            },
            {
              name: 'transition-property',
              value: 'background-color, color',
            },
          ],
          cssText:
            '\n    /* color: #001837; */\n    /* height: 7rem; */\n    /* left: 0; */\n    position: fixed;\n    top: 0;\n    transition: background-color .25s cubic-bezier(1,0,0,1),color .25s cubic-bezier(1,0,0,1);\n    width: 100%;\n    z-index: 300\n',
          range: {
            endColumn: 0,
            endLine: 2938,
            startColumn: 211,
            startLine: 2929,
          },
          shorthandEntries: [
            {
              name: 'transition',
              value:
                'background-color 0.25s cubic-bezier(1, 0, 0, 1), color 0.25s cubic-bezier(1, 0, 0, 1)',
            },
          ],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 13,
                endLine: 219,
                startColumn: 0,
                startLine: 219,
              },
              text: '.u-colorWhite',
            },
          ],
          text: '.u-colorWhite',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'color',
              range: {
                endColumn: 31,
                endLine: 220,
                startColumn: 4,
                startLine: 220,
              },
              text: '/* color: #fff!important */',
              value: '#fff!important',
            },
          ],
          cssText: '\n    /* color: #fff!important */\n',
          range: {
            endColumn: 0,
            endLine: 221,
            startColumn: 15,
            startLine: 219,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 19,
                endLine: 133,
                startColumn: 0,
                startLine: 133,
              },
              text: '.u-bgOscarLightBlue',
            },
          ],
          text: '.u-bgOscarLightBlue',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              implicit: false,
              important: true,
              name: 'background-color',
              range: {
                endColumn: 0,
                endLine: 135,
                startColumn: 4,
                startLine: 134,
              },
              text: 'background-color: #0031e2!important\n',
              value: '#0031e2!important',
            },
          ],
          cssText: '\n    background-color: #0031e2!important\n',
          range: {
            endColumn: 0,
            endLine: 135,
            startColumn: 21,
            startLine: 133,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 1,
                endLine: 1151,
                startColumn: 0,
                startLine: 1151,
              },
              text: '*',
            },
          ],
          text: '*',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              implicit: false,
              name: 'box-sizing',
              range: {
                endColumn: 24,
                endLine: 1152,
                startColumn: 4,
                startLine: 1152,
              },
              text: 'box-sizing: inherit;',
              value: 'inherit',
            },
            {
              disabled: true,
              name: 'pointer-events',
              range: {
                endColumn: 34,
                endLine: 1153,
                startColumn: 4,
                startLine: 1153,
              },
              text: '/* pointer-events: inherit; */',
              value: 'inherit',
            },
            {
              disabled: true,
              name: 'outline',
              range: {
                endColumn: 23,
                endLine: 1154,
                startColumn: 4,
                startLine: 1154,
              },
              text: '/* outline: none */',
              value: 'none',
            },
          ],
          cssText:
            '\n    box-sizing: inherit;\n    /* pointer-events: inherit; */\n    /* outline: none */\n',
          range: {
            endColumn: 0,
            endLine: 1155,
            startColumn: 3,
            startLine: 1151,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [0],
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

  const expected = [
    [true],
    [false, true],
    [false, false, false],
    [false, false, false, true, true, true, true, true, true, true, true, true],
    [false],
    [true],
    [true, false, false],
    [true],
  ];

  const mask = createStyleMask(input);

  for (let i = 0; i < mask.length; i += 1) {
    t.deepEqual(mask[i], expected[i]);
  }
});

test('diff style masks', t => {
  const before = [
    {
      matchingSelectors: [0],
      rule: {
        media: [
          {
            mediaList: [
              {
                active: true,
                expressions: [
                  {
                    computedLength: 734,
                    feature: 'min-width',
                    unit: 'px',
                    value: 734,
                  },
                ],
              },
            ],
            range: {
              endColumn: 35,
              endLine: 2967,
              startColumn: 7,
              startLine: 2967,
            },
            source: 'mediaRule',
            sourceURL: 'http://localhost:7999/oscar/index_files/bundle.css',
            styleSheetId: '75164.19',
            text: 'screen and (min-width: 734px)',
          },
        ],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 49,
                endLine: 2968,
                startColumn: 4,
                startLine: 2968,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              implicit: false,
              name: 'height',
              range: {
                endColumn: 4,
                endLine: 2970,
                startColumn: 8,
                startLine: 2969,
              },
              text: 'height: 10rem\n    ',
              value: '10rem',
            },
          ],
          cssText: '\n        height: 10rem\n    ',
          range: {
            endColumn: 4,
            endLine: 2970,
            startColumn: 51,
            startLine: 2968,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 45,
                endLine: 2962,
                startColumn: 0,
                startLine: 2962,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'color',
              range: {
                endColumn: 22,
                endLine: 2963,
                startColumn: 4,
                startLine: 2963,
              },
              text: '/* color: #fff; */',
              value: '#fff',
            },
            {
              disabled: false,
              implicit: false,
              name: 'height',
              range: {
                endColumn: 0,
                endLine: 2965,
                startColumn: 4,
                startLine: 2964,
              },
              text: 'height: 7rem\n',
              value: '7rem',
            },
          ],
          cssText: '\n    /* color: #fff; */\n    height: 7rem\n',
          range: {
            endColumn: 0,
            endLine: 2965,
            startColumn: 47,
            startLine: 2962,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [4],
      rule: {
        media: [
          {
            mediaList: [
              {
                active: true,
                expressions: [
                  {
                    computedLength: 734,
                    feature: 'min-width',
                    unit: 'px',
                    value: 734,
                  },
                ],
              },
            ],
            range: {
              endColumn: 35,
              endLine: 2940,
              startColumn: 7,
              startLine: 2940,
            },
            source: 'mediaRule',
            sourceURL: 'http://localhost:7999/oscar/index_files/bundle.css',
            styleSheetId: '75164.19',
            text: 'screen and (min-width: 734px)',
          },
        ],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 46,
                endLine: 2941,
                startColumn: 4,
                startLine: 2941,
              },
              text: '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS',
            },
            {
              range: {
                endColumn: 88,
                endLine: 2941,
                startColumn: 47,
                startLine: 2941,
              },
              text: '.navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP',
            },
            {
              range: {
                endColumn: 126,
                endLine: 2941,
                startColumn: 89,
                startLine: 2941,
              },
              text: '.navHeaderShort-eXOoccIdsiS38H7RjPxao',
            },
            {
              range: {
                endColumn: 167,
                endLine: 2941,
                startColumn: 127,
                startLine: 2941,
              },
              text: '.navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5',
            },
            {
              range: {
                endColumn: 213,
                endLine: 2941,
                startColumn: 168,
                startLine: 2941,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text:
            '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS, .navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP, .navHeaderShort-eXOoccIdsiS38H7RjPxao, .navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5, .navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'box-shadow',
              range: {
                endColumn: 31,
                endLine: 2942,
                startColumn: 8,
                startLine: 2942,
              },
              text: '/* box-shadow: none; */',
              value: 'none',
            },
            {
              disabled: true,
              name: 'height',
              range: {
                endColumn: 28,
                endLine: 2943,
                startColumn: 8,
                startLine: 2943,
              },
              text: '/* height: 10rem; */',
              value: '10rem',
            },
            {
              disabled: true,
              name: 'overflow',
              range: {
                endColumn: 31,
                endLine: 2944,
                startColumn: 8,
                startLine: 2944,
              },
              text: '/* overflow: visible */',
              value: 'visible',
            },
          ],
          cssText:
            '\n        /* box-shadow: none; */\n        /* height: 10rem; */\n        /* overflow: visible */\n    ',
          range: {
            endColumn: 4,
            endLine: 2945,
            startColumn: 215,
            startLine: 2941,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [4],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 42,
                endLine: 2929,
                startColumn: 0,
                startLine: 2929,
              },
              text: '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS',
            },
            {
              range: {
                endColumn: 84,
                endLine: 2929,
                startColumn: 43,
                startLine: 2929,
              },
              text: '.navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP',
            },
            {
              range: {
                endColumn: 122,
                endLine: 2929,
                startColumn: 85,
                startLine: 2929,
              },
              text: '.navHeaderShort-eXOoccIdsiS38H7RjPxao',
            },
            {
              range: {
                endColumn: 163,
                endLine: 2929,
                startColumn: 123,
                startLine: 2929,
              },
              text: '.navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5',
            },
            {
              range: {
                endColumn: 209,
                endLine: 2929,
                startColumn: 164,
                startLine: 2929,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text:
            '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS, .navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP, .navHeaderShort-eXOoccIdsiS38H7RjPxao, .navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5, .navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'color',
              range: {
                endColumn: 25,
                endLine: 2930,
                startColumn: 4,
                startLine: 2930,
              },
              text: '/* color: #001837; */',
              value: '#001837',
            },
            {
              disabled: true,
              name: 'height',
              range: {
                endColumn: 23,
                endLine: 2931,
                startColumn: 4,
                startLine: 2931,
              },
              text: '/* height: 7rem; */',
              value: '7rem',
            },
            {
              disabled: true,
              name: 'left',
              range: {
                endColumn: 18,
                endLine: 2932,
                startColumn: 4,
                startLine: 2932,
              },
              text: '/* left: 0; */',
              value: '0',
            },
            {
              disabled: false,
              implicit: false,
              name: 'position',
              range: {
                endColumn: 20,
                endLine: 2933,
                startColumn: 4,
                startLine: 2933,
              },
              text: 'position: fixed;',
              value: 'fixed',
            },
            {
              disabled: false,
              implicit: false,
              name: 'top',
              range: {
                endColumn: 11,
                endLine: 2934,
                startColumn: 4,
                startLine: 2934,
              },
              text: 'top: 0;',
              value: '0',
            },
            {
              disabled: false,
              implicit: false,
              name: 'transition',
              range: {
                endColumn: 93,
                endLine: 2935,
                startColumn: 4,
                startLine: 2935,
              },
              text:
                'transition: background-color .25s cubic-bezier(1,0,0,1),color .25s cubic-bezier(1,0,0,1);',
              value:
                'background-color .25s cubic-bezier(1,0,0,1),color .25s cubic-bezier(1,0,0,1)',
            },
            {
              disabled: false,
              implicit: false,
              name: 'width',
              range: {
                endColumn: 16,
                endLine: 2936,
                startColumn: 4,
                startLine: 2936,
              },
              text: 'width: 100%;',
              value: '100%',
            },
            {
              disabled: false,
              implicit: false,
              name: 'z-index',
              range: {
                endColumn: 0,
                endLine: 2938,
                startColumn: 4,
                startLine: 2937,
              },
              text: 'z-index: 300\n',
              value: '300',
            },
            {
              name: 'transition-duration',
              value: '0.25s, 0.25s',
            },
            {
              name: 'transition-timing-function',
              value: 'cubic-bezier(1, 0, 0, 1), cubic-bezier(1, 0, 0, 1)',
            },
            {
              name: 'transition-delay',
              value: 'initial, initial',
            },
            {
              name: 'transition-property',
              value: 'background-color, color',
            },
          ],
          cssText:
            '\n    /* color: #001837; */\n    /* height: 7rem; */\n    /* left: 0; */\n    position: fixed;\n    top: 0;\n    transition: background-color .25s cubic-bezier(1,0,0,1),color .25s cubic-bezier(1,0,0,1);\n    width: 100%;\n    z-index: 300\n',
          range: {
            endColumn: 0,
            endLine: 2938,
            startColumn: 211,
            startLine: 2929,
          },
          shorthandEntries: [
            {
              name: 'transition',
              value:
                'background-color 0.25s cubic-bezier(1, 0, 0, 1), color 0.25s cubic-bezier(1, 0, 0, 1)',
            },
          ],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 13,
                endLine: 219,
                startColumn: 0,
                startLine: 219,
              },
              text: '.u-colorWhite',
            },
          ],
          text: '.u-colorWhite',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'color',
              range: {
                endColumn: 31,
                endLine: 220,
                startColumn: 4,
                startLine: 220,
              },
              text: '/* color: #fff!important */',
              value: '#fff!important',
            },
          ],
          cssText: '\n    /* color: #fff!important */\n',
          range: {
            endColumn: 0,
            endLine: 221,
            startColumn: 15,
            startLine: 219,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 19,
                endLine: 133,
                startColumn: 0,
                startLine: 133,
              },
              text: '.u-bgOscarLightBlue',
            },
          ],
          text: '.u-bgOscarLightBlue',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              implicit: false,
              important: true,
              name: 'background-color',
              range: {
                endColumn: 0,
                endLine: 135,
                startColumn: 4,
                startLine: 134,
              },
              text: 'background-color: #0031e2!important\n',
              value: '#0031e2!important',
            },
          ],
          cssText: '\n    background-color: #0031e2!important\n',
          range: {
            endColumn: 0,
            endLine: 135,
            startColumn: 21,
            startLine: 133,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 1,
                endLine: 1151,
                startColumn: 0,
                startLine: 1151,
              },
              text: '*',
            },
          ],
          text: '*',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              implicit: false,
              name: 'box-sizing',
              range: {
                endColumn: 24,
                endLine: 1152,
                startColumn: 4,
                startLine: 1152,
              },
              text: 'box-sizing: inherit;',
              value: 'inherit',
            },
            {
              disabled: true,
              name: 'pointer-events',
              range: {
                endColumn: 34,
                endLine: 1153,
                startColumn: 4,
                startLine: 1153,
              },
              text: '/* pointer-events: inherit; */',
              value: 'inherit',
            },
            {
              disabled: true,
              name: 'outline',
              range: {
                endColumn: 23,
                endLine: 1154,
                startColumn: 4,
                startLine: 1154,
              },
              text: '/* outline: none */',
              value: 'none',
            },
          ],
          cssText:
            '\n    box-sizing: inherit;\n    /* pointer-events: inherit; */\n    /* outline: none */\n',
          range: {
            endColumn: 0,
            endLine: 1155,
            startColumn: 3,
            startLine: 1151,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [0],
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

  const after = [
    {
      matchingSelectors: [0],
      rule: {
        media: [
          {
            mediaList: [
              {
                active: true,
                expressions: [
                  {
                    computedLength: 734,
                    feature: 'min-width',
                    unit: 'px',
                    value: 734,
                  },
                ],
              },
            ],
            range: {
              endColumn: 35,
              endLine: 2967,
              startColumn: 7,
              startLine: 2967,
            },
            source: 'mediaRule',
            sourceURL: 'http://localhost:7999/oscar/index_files/bundle.css',
            styleSheetId: '75164.32',
            text: 'screen and (min-width: 734px)',
          },
        ],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 49,
                endLine: 2968,
                startColumn: 4,
                startLine: 2968,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              implicit: false,
              name: 'height',
              range: {
                endColumn: 4,
                endLine: 2970,
                startColumn: 8,
                startLine: 2969,
              },
              text: 'height: 10rem\n    ',
              value: '10rem',
            },
          ],
          cssText: '\n        height: 10rem\n    ',
          range: {
            endColumn: 4,
            endLine: 2970,
            startColumn: 51,
            startLine: 2968,
          },
          shorthandEntries: [],
          styleSheetId: '75164.32',
        },
        styleSheetId: '75164.32',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 45,
                endLine: 2962,
                startColumn: 0,
                startLine: 2962,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              name: 'color',
              range: {
                endColumn: 22,
                endLine: 2963,
                startColumn: 4,
                startLine: 2963,
              },
              text: '/* color: #fff; */',
              value: '#fff',
            },
            {
              disabled: false,
              implicit: false,
              name: 'height',
              range: {
                endColumn: 0,
                endLine: 2965,
                startColumn: 4,
                startLine: 2964,
              },
              text: 'height: 7rem\n',
              value: '7rem',
            },
          ],
          cssText: '\n    /* color: #fff; */\n    height: 7rem\n',
          range: {
            endColumn: 0,
            endLine: 2965,
            startColumn: 47,
            startLine: 2962,
          },
          shorthandEntries: [],
          styleSheetId: '75164.32',
        },
        styleSheetId: '75164.32',
      },
    },
    {
      matchingSelectors: [4],
      rule: {
        media: [
          {
            mediaList: [
              {
                active: true,
                expressions: [
                  {
                    computedLength: 734,
                    feature: 'min-width',
                    unit: 'px',
                    value: 734,
                  },
                ],
              },
            ],
            range: {
              endColumn: 35,
              endLine: 2940,
              startColumn: 7,
              startLine: 2940,
            },
            source: 'mediaRule',
            sourceURL: 'http://localhost:7999/oscar/index_files/bundle.css',
            styleSheetId: '75164.32',
            text: 'screen and (min-width: 734px)',
          },
        ],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 46,
                endLine: 2941,
                startColumn: 4,
                startLine: 2941,
              },
              text: '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS',
            },
            {
              range: {
                endColumn: 88,
                endLine: 2941,
                startColumn: 47,
                startLine: 2941,
              },
              text: '.navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP',
            },
            {
              range: {
                endColumn: 126,
                endLine: 2941,
                startColumn: 89,
                startLine: 2941,
              },
              text: '.navHeaderShort-eXOoccIdsiS38H7RjPxao',
            },
            {
              range: {
                endColumn: 167,
                endLine: 2941,
                startColumn: 127,
                startLine: 2941,
              },
              text: '.navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5',
            },
            {
              range: {
                endColumn: 213,
                endLine: 2941,
                startColumn: 168,
                startLine: 2941,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text:
            '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS, .navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP, .navHeaderShort-eXOoccIdsiS38H7RjPxao, .navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5, .navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'box-shadow',
              range: {
                endColumn: 31,
                endLine: 2942,
                startColumn: 8,
                startLine: 2942,
              },
              text: '/* box-shadow: none; */',
              value: 'none',
            },
            {
              disabled: true,
              name: 'height',
              range: {
                endColumn: 28,
                endLine: 2943,
                startColumn: 8,
                startLine: 2943,
              },
              text: '/* height: 10rem; */',
              value: '10rem',
            },
            {
              disabled: true,
              name: 'overflow',
              range: {
                endColumn: 31,
                endLine: 2944,
                startColumn: 8,
                startLine: 2944,
              },
              text: '/* overflow: visible */',
              value: 'visible',
            },
          ],
          cssText:
            '\n        /* box-shadow: none; */\n        /* height: 10rem; */\n        /* overflow: visible */\n    ',
          range: {
            endColumn: 4,
            endLine: 2945,
            startColumn: 215,
            startLine: 2941,
          },
          shorthandEntries: [],
          styleSheetId: '75164.32',
        },
        styleSheetId: '75164.32',
      },
    },
    {
      matchingSelectors: [4],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 42,
                endLine: 2929,
                startColumn: 0,
                startLine: 2929,
              },
              text: '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS',
            },
            {
              range: {
                endColumn: 84,
                endLine: 2929,
                startColumn: 43,
                startLine: 2929,
              },
              text: '.navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP',
            },
            {
              range: {
                endColumn: 122,
                endLine: 2929,
                startColumn: 85,
                startLine: 2929,
              },
              text: '.navHeaderShort-eXOoccIdsiS38H7RjPxao',
            },
            {
              range: {
                endColumn: 163,
                endLine: 2929,
                startColumn: 123,
                startLine: 2929,
              },
              text: '.navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5',
            },
            {
              range: {
                endColumn: 209,
                endLine: 2929,
                startColumn: 164,
                startLine: 2929,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text:
            '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS, .navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP, .navHeaderShort-eXOoccIdsiS38H7RjPxao, .navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5, .navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'color',
              range: {
                endColumn: 25,
                endLine: 2930,
                startColumn: 4,
                startLine: 2930,
              },
              text: '/* color: #001837; */',
              value: '#001837',
            },
            {
              disabled: true,
              name: 'height',
              range: {
                endColumn: 23,
                endLine: 2931,
                startColumn: 4,
                startLine: 2931,
              },
              text: '/* height: 7rem; */',
              value: '7rem',
            },
            {
              disabled: true,
              name: 'left',
              range: {
                endColumn: 18,
                endLine: 2932,
                startColumn: 4,
                startLine: 2932,
              },
              text: '/* left: 0; */',
              value: '0',
            },
            {
              disabled: false,
              implicit: false,
              name: 'position',
              range: {
                endColumn: 20,
                endLine: 2933,
                startColumn: 4,
                startLine: 2933,
              },
              text: 'position: fixed;',
              value: 'fixed',
            },
            {
              disabled: false,
              implicit: false,
              name: 'top',
              range: {
                endColumn: 11,
                endLine: 2934,
                startColumn: 4,
                startLine: 2934,
              },
              text: 'top: 0;',
              value: '0',
            },
            {
              disabled: true,
              name: 'transition',
              range: {
                endColumn: 99,
                endLine: 2935,
                startColumn: 4,
                startLine: 2935,
              },
              text:
                '/* transition: background-color .25s cubic-bezier(1,0,0,1),color .25s cubic-bezier(1,0,0,1); */',
              value:
                'background-color .25s cubic-bezier(1,0,0,1),color .25s cubic-bezier(1,0,0,1)',
            },
            {
              disabled: false,
              implicit: false,
              name: 'width',
              range: {
                endColumn: 16,
                endLine: 2936,
                startColumn: 4,
                startLine: 2936,
              },
              text: 'width: 100%;',
              value: '100%',
            },
            {
              disabled: false,
              implicit: false,
              name: 'z-index',
              range: {
                endColumn: 0,
                endLine: 2938,
                startColumn: 4,
                startLine: 2937,
              },
              text: 'z-index: 300\n',
              value: '300',
            },
          ],
          cssText:
            '\n    /* color: #001837; */\n    /* height: 7rem; */\n    /* left: 0; */\n    position: fixed;\n    top: 0;\n    /* transition: background-color .25s cubic-bezier(1,0,0,1),color .25s cubic-bezier(1,0,0,1); */\n    width: 100%;\n    z-index: 300\n',
          range: {
            endColumn: 0,
            endLine: 2938,
            startColumn: 211,
            startLine: 2929,
          },
          shorthandEntries: [],
          styleSheetId: '75164.32',
        },
        styleSheetId: '75164.32',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 13,
                endLine: 219,
                startColumn: 0,
                startLine: 219,
              },
              text: '.u-colorWhite',
            },
          ],
          text: '.u-colorWhite',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'color',
              range: {
                endColumn: 31,
                endLine: 220,
                startColumn: 4,
                startLine: 220,
              },
              text: '/* color: #fff!important */',
              value: '#fff!important',
            },
          ],
          cssText: '\n    /* color: #fff!important */\n',
          range: {
            endColumn: 0,
            endLine: 221,
            startColumn: 15,
            startLine: 219,
          },
          shorthandEntries: [],
          styleSheetId: '75164.32',
        },
        styleSheetId: '75164.32',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 19,
                endLine: 133,
                startColumn: 0,
                startLine: 133,
              },
              text: '.u-bgOscarLightBlue',
            },
          ],
          text: '.u-bgOscarLightBlue',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              implicit: false,
              important: true,
              name: 'background-color',
              range: {
                endColumn: 0,
                endLine: 135,
                startColumn: 4,
                startLine: 134,
              },
              text: 'background-color: #0031e2!important\n',
              value: '#0031e2!important',
            },
          ],
          cssText: '\n    background-color: #0031e2!important\n',
          range: {
            endColumn: 0,
            endLine: 135,
            startColumn: 21,
            startLine: 133,
          },
          shorthandEntries: [],
          styleSheetId: '75164.32',
        },
        styleSheetId: '75164.32',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 1,
                endLine: 1151,
                startColumn: 0,
                startLine: 1151,
              },
              text: '*',
            },
          ],
          text: '*',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              implicit: false,
              name: 'box-sizing',
              range: {
                endColumn: 24,
                endLine: 1152,
                startColumn: 4,
                startLine: 1152,
              },
              text: 'box-sizing: inherit;',
              value: 'inherit',
            },
            {
              disabled: true,
              name: 'pointer-events',
              range: {
                endColumn: 34,
                endLine: 1153,
                startColumn: 4,
                startLine: 1153,
              },
              text: '/* pointer-events: inherit; */',
              value: 'inherit',
            },
            {
              disabled: true,
              name: 'outline',
              range: {
                endColumn: 23,
                endLine: 1154,
                startColumn: 4,
                startLine: 1154,
              },
              text: '/* outline: none */',
              value: 'none',
            },
          ],
          cssText:
            '\n    box-sizing: inherit;\n    /* pointer-events: inherit; */\n    /* outline: none */\n',
          range: {
            endColumn: 0,
            endLine: 1155,
            startColumn: 3,
            startLine: 1151,
          },
          shorthandEntries: [],
          styleSheetId: '75164.32',
        },
        styleSheetId: '75164.32',
      },
    },
    {
      matchingSelectors: [0],
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

  const beforeMask = createStyleMask(before);
  const afterMask = createStyleMask(after);
  const nodeId = 1;
  const diff = diffStyleMasks(nodeId, beforeMask)(afterMask);

  const expected = {
    disabled: [[1, 3, 5], [1, 3, 8], [1, 3, 9], [1, 3, 10], [1, 3, 11]],
    enabled: [[1, 1, 0]],
  };

  t.deepEqual(diff.disabled, expected.disabled);
});

test('check if property is active in style mask', t => {
  const input = [
    {
      matchingSelectors: [0],
      rule: {
        media: [
          {
            mediaList: [
              {
                active: true,
                expressions: [
                  {
                    computedLength: 734,
                    feature: 'min-width',
                    unit: 'px',
                    value: 734,
                  },
                ],
              },
            ],
            range: {
              endColumn: 35,
              endLine: 2967,
              startColumn: 7,
              startLine: 2967,
            },
            source: 'mediaRule',
            sourceURL: 'http://localhost:7999/oscar/index_files/bundle.css',
            styleSheetId: '75164.19',
            text: 'screen and (min-width: 734px)',
          },
        ],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 49,
                endLine: 2968,
                startColumn: 4,
                startLine: 2968,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              implicit: false,
              name: 'height',
              range: {
                endColumn: 4,
                endLine: 2970,
                startColumn: 8,
                startLine: 2969,
              },
              text: 'height: 10rem\n    ',
              value: '10rem',
            },
          ],
          cssText: '\n        height: 10rem\n    ',
          range: {
            endColumn: 4,
            endLine: 2970,
            startColumn: 51,
            startLine: 2968,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 45,
                endLine: 2962,
                startColumn: 0,
                startLine: 2962,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'color',
              range: {
                endColumn: 22,
                endLine: 2963,
                startColumn: 4,
                startLine: 2963,
              },
              text: '/* color: #fff; */',
              value: '#fff',
            },
            {
              disabled: false,
              implicit: false,
              name: 'height',
              range: {
                endColumn: 0,
                endLine: 2965,
                startColumn: 4,
                startLine: 2964,
              },
              text: 'height: 7rem\n',
              value: '7rem',
            },
          ],
          cssText: '\n    /* color: #fff; */\n    height: 7rem\n',
          range: {
            endColumn: 0,
            endLine: 2965,
            startColumn: 47,
            startLine: 2962,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [4],
      rule: {
        media: [
          {
            mediaList: [
              {
                active: true,
                expressions: [
                  {
                    computedLength: 734,
                    feature: 'min-width',
                    unit: 'px',
                    value: 734,
                  },
                ],
              },
            ],
            range: {
              endColumn: 35,
              endLine: 2940,
              startColumn: 7,
              startLine: 2940,
            },
            source: 'mediaRule',
            sourceURL: 'http://localhost:7999/oscar/index_files/bundle.css',
            styleSheetId: '75164.19',
            text: 'screen and (min-width: 734px)',
          },
        ],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 46,
                endLine: 2941,
                startColumn: 4,
                startLine: 2941,
              },
              text: '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS',
            },
            {
              range: {
                endColumn: 88,
                endLine: 2941,
                startColumn: 47,
                startLine: 2941,
              },
              text: '.navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP',
            },
            {
              range: {
                endColumn: 126,
                endLine: 2941,
                startColumn: 89,
                startLine: 2941,
              },
              text: '.navHeaderShort-eXOoccIdsiS38H7RjPxao',
            },
            {
              range: {
                endColumn: 167,
                endLine: 2941,
                startColumn: 127,
                startLine: 2941,
              },
              text: '.navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5',
            },
            {
              range: {
                endColumn: 213,
                endLine: 2941,
                startColumn: 168,
                startLine: 2941,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text:
            '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS, .navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP, .navHeaderShort-eXOoccIdsiS38H7RjPxao, .navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5, .navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'box-shadow',
              range: {
                endColumn: 31,
                endLine: 2942,
                startColumn: 8,
                startLine: 2942,
              },
              text: '/* box-shadow: none; */',
              value: 'none',
            },
            {
              disabled: true,
              name: 'height',
              range: {
                endColumn: 28,
                endLine: 2943,
                startColumn: 8,
                startLine: 2943,
              },
              text: '/* height: 10rem; */',
              value: '10rem',
            },
            {
              disabled: true,
              name: 'overflow',
              range: {
                endColumn: 31,
                endLine: 2944,
                startColumn: 8,
                startLine: 2944,
              },
              text: '/* overflow: visible */',
              value: 'visible',
            },
          ],
          cssText:
            '\n        /* box-shadow: none; */\n        /* height: 10rem; */\n        /* overflow: visible */\n    ',
          range: {
            endColumn: 4,
            endLine: 2945,
            startColumn: 215,
            startLine: 2941,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [4],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 42,
                endLine: 2929,
                startColumn: 0,
                startLine: 2929,
              },
              text: '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS',
            },
            {
              range: {
                endColumn: 84,
                endLine: 2929,
                startColumn: 43,
                startLine: 2929,
              },
              text: '.navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP',
            },
            {
              range: {
                endColumn: 122,
                endLine: 2929,
                startColumn: 85,
                startLine: 2929,
              },
              text: '.navHeaderShort-eXOoccIdsiS38H7RjPxao',
            },
            {
              range: {
                endColumn: 163,
                endLine: 2929,
                startColumn: 123,
                startLine: 2929,
              },
              text: '.navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5',
            },
            {
              range: {
                endColumn: 209,
                endLine: 2929,
                startColumn: 164,
                startLine: 2929,
              },
              text: '.navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
            },
          ],
          text:
            '.navHeaderHasBanner-3rQVtTrEkCWdKFqj2Lu8lS, .navHeaderNoCenter-1-PoTwgY-CGMSNMmCL5uRP, .navHeaderShort-eXOoccIdsiS38H7RjPxao, .navHeaderWrapper-3GbasrtkfUf0mLlgFmMTv5, .navHeaderWrapperWhite-3oby4f18yRexsaOYq-K9TX',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'color',
              range: {
                endColumn: 25,
                endLine: 2930,
                startColumn: 4,
                startLine: 2930,
              },
              text: '/* color: #001837; */',
              value: '#001837',
            },
            {
              disabled: true,
              name: 'height',
              range: {
                endColumn: 23,
                endLine: 2931,
                startColumn: 4,
                startLine: 2931,
              },
              text: '/* height: 7rem; */',
              value: '7rem',
            },
            {
              disabled: true,
              name: 'left',
              range: {
                endColumn: 18,
                endLine: 2932,
                startColumn: 4,
                startLine: 2932,
              },
              text: '/* left: 0; */',
              value: '0',
            },
            {
              disabled: false,
              implicit: false,
              name: 'position',
              range: {
                endColumn: 20,
                endLine: 2933,
                startColumn: 4,
                startLine: 2933,
              },
              text: 'position: fixed;',
              value: 'fixed',
            },
            {
              disabled: false,
              implicit: false,
              name: 'top',
              range: {
                endColumn: 11,
                endLine: 2934,
                startColumn: 4,
                startLine: 2934,
              },
              text: 'top: 0;',
              value: '0',
            },
            {
              disabled: false,
              implicit: false,
              name: 'transition',
              range: {
                endColumn: 93,
                endLine: 2935,
                startColumn: 4,
                startLine: 2935,
              },
              text:
                'transition: background-color .25s cubic-bezier(1,0,0,1),color .25s cubic-bezier(1,0,0,1);',
              value:
                'background-color .25s cubic-bezier(1,0,0,1),color .25s cubic-bezier(1,0,0,1)',
            },
            {
              disabled: false,
              implicit: false,
              name: 'width',
              range: {
                endColumn: 16,
                endLine: 2936,
                startColumn: 4,
                startLine: 2936,
              },
              text: 'width: 100%;',
              value: '100%',
            },
            {
              disabled: false,
              implicit: false,
              name: 'z-index',
              range: {
                endColumn: 0,
                endLine: 2938,
                startColumn: 4,
                startLine: 2937,
              },
              text: 'z-index: 300\n',
              value: '300',
            },
            {
              name: 'transition-duration',
              value: '0.25s, 0.25s',
            },
            {
              name: 'transition-timing-function',
              value: 'cubic-bezier(1, 0, 0, 1), cubic-bezier(1, 0, 0, 1)',
            },
            {
              name: 'transition-delay',
              value: 'initial, initial',
            },
            {
              name: 'transition-property',
              value: 'background-color, color',
            },
          ],
          cssText:
            '\n    /* color: #001837; */\n    /* height: 7rem; */\n    /* left: 0; */\n    position: fixed;\n    top: 0;\n    transition: background-color .25s cubic-bezier(1,0,0,1),color .25s cubic-bezier(1,0,0,1);\n    width: 100%;\n    z-index: 300\n',
          range: {
            endColumn: 0,
            endLine: 2938,
            startColumn: 211,
            startLine: 2929,
          },
          shorthandEntries: [
            {
              name: 'transition',
              value:
                'background-color 0.25s cubic-bezier(1, 0, 0, 1), color 0.25s cubic-bezier(1, 0, 0, 1)',
            },
          ],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 13,
                endLine: 219,
                startColumn: 0,
                startLine: 219,
              },
              text: '.u-colorWhite',
            },
          ],
          text: '.u-colorWhite',
        },
        style: {
          cssProperties: [
            {
              disabled: true,
              name: 'color',
              range: {
                endColumn: 31,
                endLine: 220,
                startColumn: 4,
                startLine: 220,
              },
              text: '/* color: #fff!important */',
              value: '#fff!important',
            },
          ],
          cssText: '\n    /* color: #fff!important */\n',
          range: {
            endColumn: 0,
            endLine: 221,
            startColumn: 15,
            startLine: 219,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 19,
                endLine: 133,
                startColumn: 0,
                startLine: 133,
              },
              text: '.u-bgOscarLightBlue',
            },
          ],
          text: '.u-bgOscarLightBlue',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              implicit: false,
              important: true,
              name: 'background-color',
              range: {
                endColumn: 0,
                endLine: 135,
                startColumn: 4,
                startLine: 134,
              },
              text: 'background-color: #0031e2!important\n',
              value: '#0031e2!important',
            },
          ],
          cssText: '\n    background-color: #0031e2!important\n',
          range: {
            endColumn: 0,
            endLine: 135,
            startColumn: 21,
            startLine: 133,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [0],
      rule: {
        media: [],
        origin: 'regular',
        selectorList: {
          selectors: [
            {
              range: {
                endColumn: 1,
                endLine: 1151,
                startColumn: 0,
                startLine: 1151,
              },
              text: '*',
            },
          ],
          text: '*',
        },
        style: {
          cssProperties: [
            {
              disabled: false,
              implicit: false,
              name: 'box-sizing',
              range: {
                endColumn: 24,
                endLine: 1152,
                startColumn: 4,
                startLine: 1152,
              },
              text: 'box-sizing: inherit;',
              value: 'inherit',
            },
            {
              disabled: true,
              name: 'pointer-events',
              range: {
                endColumn: 34,
                endLine: 1153,
                startColumn: 4,
                startLine: 1153,
              },
              text: '/* pointer-events: inherit; */',
              value: 'inherit',
            },
            {
              disabled: true,
              name: 'outline',
              range: {
                endColumn: 23,
                endLine: 1154,
                startColumn: 4,
                startLine: 1154,
              },
              text: '/* outline: none */',
              value: 'none',
            },
          ],
          cssText:
            '\n    box-sizing: inherit;\n    /* pointer-events: inherit; */\n    /* outline: none */\n',
          range: {
            endColumn: 0,
            endLine: 1155,
            startColumn: 3,
            startLine: 1151,
          },
          shorthandEntries: [],
          styleSheetId: '75164.19',
        },
        styleSheetId: '75164.19',
      },
    },
    {
      matchingSelectors: [0],
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

  const mask = createStyleMask(input);
  t.true(isPropertyActive(mask)([3, 3]));
  t.false(isPropertyActive(mask)([3, 2]));
});

test('build CSS from example', t => {
  const input = {
    '.foo': {
      margin: '10px',
      'margin-top': '20px',
      'margin-right': '// 20px',
      'margin-bottom': '// 20px !important',
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
            { name: 'margin-right', value: '// 20px', disabled: true },
            {
              name: 'margin-bottom',
              value: '// 20px !important',
              important: true,
              disabled: true,
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
