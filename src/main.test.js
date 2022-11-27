/* eslint-disable max-lines */
import test from 'ava'
import stringByteLength from 'string-byte-length'
import stringByteSlice from 'string-byte-slice'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import { bufferSlice } from './buffer.js'
// eslint-disable-next-line no-restricted-imports
import { charCodeSlice } from './char_code/main.js'
// eslint-disable-next-line no-restricted-imports
import { textEncoderSlice } from './encoder.js'

const LONG_STRING_LENGTH = 1e6

each(
  [stringByteSlice, bufferSlice, textEncoderSlice, charCodeSlice],
  [true, false],
  [true, false],
  /* eslint-disable no-magic-numbers */
  [
    // Normal positive|negative indices
    ['abcd', 'bcd', 1],
    ['abcd', 'abc', 0, 3],
    ['abcd', 'bc', 1, 3],

    // Very low|high indices
    ['abcd', '', 10],
    ['abcd', '', 100],
    ['abcd', '', 0, -10],
    ['abcd', '', 0, -100],
    ['abcd', 'abcd', -10],
    ['abcd', 'abcd', -100],
    ['abcd', 'abcd', 0, 10],
    ['abcd', 'abcd', 0, 100],

    // Empty string
    ['', '', 0],
    ['', '', 1, 3],

    // 2-bytes characters
    ['\u00B1a', '\u00B1a', 0],
    ['\u00B1a', 'a', 1],
    ['\u00B1a', 'a', 2],
    ['\u00B1a', '', 3],
    ['a\u00B1', 'a\u00B1', 0, 3],
    ['a\u00B1', 'a', 0, 2],
    ['a\u00B1', 'a', 0, 1],
    ['a\u00B1', '', 0, 0],

    // 3-bytes characters (before surrogates)
    ['\u25CAa', '\u25CAa', 0],
    ['\u25CAa', 'a', 1],
    ['\u25CAa', 'a', 2],
    ['\u25CAa', 'a', 3],
    ['\u25CAa', '', 4],
    ['a\u25CA', 'a\u25CA', 0, 4],
    ['a\u25CA', 'a', 0, 3],
    ['a\u25CA', 'a', 0, 2],
    ['a\u25CA', 'a', 0, 1],
    ['a\u25CA', '', 0, 0],

    // 3-bytes characters (after surrogates)
    ['\uFB00a', '\uFB00a', 0],
    ['\uFB00a', 'a', 1],
    ['\uFB00a', 'a', 2],
    ['\uFB00a', 'a', 3],
    ['\uFB00a', '', 4],
    ['a\uFB00', 'a\uFB00', 0, 4],
    ['a\uFB00', 'a', 0, 3],
    ['a\uFB00', 'a', 0, 2],
    ['a\uFB00', 'a', 0, 1],
    ['a\uFB00', '', 0, 0],

    // Isolated high surrogate
    ['\uD800a', '\uFFFDa', 0],
    ['\uD800a', 'a', 1],
    ['\uD800a', 'a', 2],
    ['\uD800a', 'a', 3],
    ['\uD800a', '', 4],
    ['a\uD800', 'a\uFFFD', 0, 4],
    ['a\uD800', 'a', 0, 3],
    ['a\uD800', 'a', 0, 2],
    ['a\uD800', 'a', 0, 1],
    ['a\uD800', '', 0, 0],

    // Isolated low surrogate
    ['\uDC00\uFB00', '\uFFFD\uFB00', 0],
    ['\uDC00\uFB00', '\uFB00', 1],
    ['\uDC00\uFB00', '\uFB00', 2],
    ['\uDC00\uFB00', '\uFB00', 3],
    ['\uDC00\uFB00', '', 4],
    ['\uFB00\uDC00', '\uFB00\uFFFD', 0, 6],
    ['\uFB00\uDC00', '\uFB00', 0, 5],
    ['\uFB00\uDC00', '\uFB00', 0, 4],
    ['\uFB00\uDC00', '\uFB00', 0, 3],
    ['\uFB00\uDC00', '', 0, 2],

    // Astral characters
    ['\u{1F525}a', '\u{1F525}a', 0],
    ['\u{1F525}a', 'a', 1],
    ['\u{1F525}a', 'a', 2],
    ['\u{1F525}a', 'a', 3],
    ['\u{1F525}a', 'a', 4],
    ['\u{1F525}a', '', 5],
    ['a\u{1F525}', 'a\u{1F525}', 0, 5],
    ['a\u{1F525}', 'a', 0, 4],
    ['a\u{1F525}', 'a', 0, 3],
    ['a\u{1F525}', 'a', 0, 2],
    ['a\u{1F525}', 'a', 0, 1],
    ['a\u{1F525}', '', 0, 0],

    // Long strings
    ...['a', '\u00B1', '\u25CA', '\u{1F525}'].map((char) => [
      char.repeat(LONG_STRING_LENGTH),
      char.repeat(LONG_STRING_LENGTH - 1),
      1,
    ]),
  ],
  /* eslint-enable no-magic-numbers */
  /* eslint-disable max-params */
  (
    { title },
    sliceMethod,
    negativeStart,
    negativeEnd,
    [input, output, byteStart, byteEnd],
  ) => {
    /* eslint-enable max-params */
    test(`String slice | ${title}`, (t) => {
      const byteStartA = getByteIndex(input, byteStart, negativeStart)
      const byteEndA = getByteIndex(input, byteEnd, negativeEnd)
      t.is(sliceMethod(input, byteStartA, byteEndA), output)
    })
  },
)

// Iterate all tests using either positive or negative indices.
// Works with -0 index.
const getByteIndex = function (input, byteIndex, isNegative) {
  if (!isNegative) {
    return byteIndex
  }

  return byteIndex === undefined
    ? -0
    : -Math.max(stringByteLength(input) - byteIndex, 0)
}
/* eslint-enable max-lines */
