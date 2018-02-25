// @flow @format

/**
 * Utilities for editing style texts.
 */

import { assert } from './utils';

import type {
  CRDP$CSSStyle,
  CRDP$CSSProperty,
  CRDP$SourceRange,
} from 'devtools-typed/domain/CSS';

type IndexRange = [number, number];

export function replacePropertyInStyleText(
  style: CRDP$CSSStyle,
  property: CRDP$CSSProperty,
  replacement: string,
): string {
  if (!style.range) {
    throw new Error('Style not editable');
  }
  if (!property.range) {
    throw new Error('Property not editable');
  }
  if (!style.cssText) {
    throw new Error('No style text');
  }
  const { cssText } = style;
  const range = relativeRange(style.range, property.range);
  const newStyleText = replaceRange(cssText, range, replacement);
  return newStyleText;
}

function relativeRange(
  styleRange: CRDP$SourceRange,
  propertyRange: CRDP$SourceRange,
): CRDP$SourceRange {
  assert(
    styleRange.startLine <= propertyRange.startLine &&
      propertyRange.endLine <= styleRange.endLine,
    'property not part of style',
  );

  const startLine = propertyRange.startLine - styleRange.startLine;
  const endLine = propertyRange.endLine - styleRange.startLine;
  const startColumn = propertyRange.startColumn;
  const endColumn = propertyRange.endColumn;

  assert(
    startLine <= endLine,
    `invalid range lines ${startLine} and ${endLine}`,
  );

  return { startLine, startColumn, endLine, endColumn };
}

export function replaceRange(
  str: string,
  range: CRDP$SourceRange,
  replacement: string,
): string {
  const [startIndex, endIndex] = sourceRangeToIndices(str, range);
  const prefix = str.substring(0, startIndex);
  const suffix = str.substring(endIndex);
  const result = `${prefix}${replacement}${suffix}`;
  return result;
}

export function sourceRangeToIndices(
  str: string,
  range: CRDP$SourceRange,
): IndexRange {
  const { startLine, endLine, startColumn, endColumn } = range;
  assert(
    startLine <= endLine,
    `invalid range lines ${startLine} and ${endLine}`,
  );

  const lines = str.split('\n');
  const numLines = lines.length;
  assert(
    endLine - startLine <= numLines,
    `range ${endLine - startLine} exceeds number of lines ${numLines}`,
  );

  // Add 1 to the length of every line but the last, for the newline character.
  const lineLengths = lines.map(
    (s, idx) => (idx < numLines - 1 ? s.length + 1 : s.length),
  );

  assert(
    startColumn < lines[startLine].length,
    `startColumn ${startColumn} exceeds startLine length ${lines[startLine]
      .length}`,
  );
  assert(
    endColumn <= lines[endLine].length,
    `endColumn ${endColumn} exceeds endLine length ${lines[endLine].length}`,
  );

  const sum = arr => arr.reduce((a, b) => a + b, 0);
  const startIndex = sum(lineLengths.slice(0, startLine)) + startColumn;
  const endIndex = sum(lineLengths.slice(0, endLine)) + endColumn;

  assert(startIndex <= endIndex, 'endIndex greater than startIndex');

  return [startIndex, endIndex];
}
