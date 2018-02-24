// @flow @format
import test from 'ava';
import {
  sourceRangeToIndices,
  replaceRange,
  replacePropertyInStyleText,
} from '../src/styles';

test('converting one-line CSSSourceRange to indices', t => {
  const str = `line zero
line one
  indented line two
  `;
  const range = {
    startLine: 0,
    startColumn: 0,
    endLine: 0,
    endColumn: 7,
  };
  const indices = sourceRangeToIndices(str, range);
  const substring = str.substring(...indices);
  t.is(substring, 'line ze');
});

test('converting multi-line CSSSourceRange to indices', t => {
  const str = `line zero
line one
  indented line two
  `;
  const range = {
    startLine: 1,
    startColumn: 3,
    endLine: 2,
    endColumn: 17,
  };
  const indices = sourceRangeToIndices(str, range);
  const substring = str.substring(...indices);
  t.is(
    substring,
    `e one
  indented line t`,
  );
});

test('replace multi-line text ranges', t => {
  const str = `line zero
line one
  indented line two
  `;
  const range = {
    startLine: 1,
    startColumn: 3,
    endLine: 2,
    endColumn: 17,
  };
  const result = replaceRange(str, range, 'floobar');
  t.is(
    result,
    `line zero
linfloobarwo
  `,
  );
});

test('replace property in style', t => {
  const style = {
    cssProperties: [
      {
        disabled: false,
        implicit: false,
        name: 'border-color',
        range: {
          endColumn: 23,
          endLine: 17471,
          startColumn: 4,
          startLine: 17471,
        },
        text: 'border-color: #000;',
        value: '#000',
      },
      {
        disabled: false,
        implicit: false,
        name: 'color',
        range: {
          endColumn: 16,
          endLine: 17472,
          startColumn: 4,
          startLine: 17472,
        },
        text: 'color: #000;',
        value: '#000',
      },
      {
        disabled: false,
        implicit: false,
        name: 'margin-bottom',
        range: {
          endColumn: 0,
          endLine: 17474,
          startColumn: 4,
          startLine: 17473,
        },
        text: 'margin-bottom: 35px\n',
        value: '35px',
      },
      {
        name: 'border-top-color',
        value: 'rgb(0, 0, 0)',
      },
      {
        name: 'border-right-color',
        value: 'rgb(0, 0, 0)',
      },
      {
        name: 'border-bottom-color',
        value: 'rgb(0, 0, 0)',
      },
      {
        name: 'border-left-color',
        value: 'rgb(0, 0, 0)',
      },
    ],
    cssText:
      '\n    border-color: #000;\n    color: #000;\n    margin-bottom: 35px\n',
    range: {
      endColumn: 0,
      endLine: 17474,
      startColumn: 27,
      startLine: 17470,
    },
    shorthandEntries: [
      {
        name: 'border-color',
        value: 'rgb(0, 0, 0)',
      },
    ],
    styleSheetId: '28618.56',
  };

  const property = {
    disabled: false,
    implicit: false,
    name: 'border-color',
    range: {
      endColumn: 23,
      endLine: 17471,
      startColumn: 4,
      startLine: 17471,
    },
    text: 'border-color: #000;',
    value: '#000',
  };

  const result = replacePropertyInStyleText(
    style,
    property,
    '/* border-color: #000; */',
  );

  t.is(
    result,
    '\n    /* border-color: #000; */\n    color: #000;\n    margin-bottom: 35px\n',
  );
});

test('replace property in style with multiple substring occurrences', t => {
  const style = {
    cssProperties: [
      {
        disabled: true,
        name: 'border-color',
        range: {
          endColumn: 29,
          endLine: 17471,
          startColumn: 4,
          startLine: 17471,
        },
        text: '/* border-color: #000; */',
        value: '#000',
      },
      {
        disabled: false,
        implicit: false,
        name: 'color',
        range: {
          endColumn: 16,
          endLine: 17472,
          startColumn: 4,
          startLine: 17472,
        },
        text: 'color: #000;',
        value: '#000',
      },
      {
        disabled: false,
        implicit: false,
        name: 'margin-bottom',
        range: {
          endColumn: 0,
          endLine: 17477,
          startColumn: 4,
          startLine: 17473,
        },
        text: 'margin-bottom: 35px\n\n\n\n',
        value: '35px',
      },
    ],
    cssText:
      '\n    /* border-color: #000; */\n    color: #000;\n    margin-bottom: 35px\n\n\n\n',
    range: {
      endColumn: 0,
      endLine: 17477,
      startColumn: 27,
      startLine: 17470,
    },
    shorthandEntries: [],
    styleSheetId: '28618.145',
  };
  const property = {
    disabled: false,
    implicit: false,
    name: 'color',
    range: {
      endColumn: 16,
      endLine: 17472,
      startColumn: 4,
      startLine: 17472,
    },
    text: 'color: #000;',
    value: '#000',
  };

  const result = replacePropertyInStyleText(
    style,
    property,
    '/* color: #000; */',
  );

  t.is(
    result,
    '\n    /* border-color: #000; */\n    /* color: #000; */\n    margin-bottom: 35px\n\n\n\n',
  );
});
