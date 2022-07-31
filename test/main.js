import test from 'ava'
import stringByteSlice from 'string-byte-slice'
import { each } from 'test-each'

each(
  /* eslint-disable no-magic-numbers */
  [
    // Normal positive|negative indices
    ['abcd', 'bcd', 1],
    ['abcd', 'bcd', -3],
    ['abcd', 'abc', 0, 3],
    ['abcd', 'abc', 0, -1],

    // Mix of positive|negative indices
    ['abcd', 'bc', 1, 3],
    ['abcd', 'bc', 1, -1],
    ['abcd', 'bc', -3, 3],
    ['abcd', 'bc', -3, -1],

    // Very low|high indices
    ['abcd', '', 10],
    ['abcd', '', 0, -10],
    ['abcd', 'abcd', -10],
    ['abcd', 'abcd', 0, 10],

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

    // Isolated low surrogate
    ['\uD800a', '\uD800a', 0],
    ['\uD800a', 'a', 1],
    ['\uD800a', 'a', 2],
    ['\uD800a', 'a', 3],
    ['\uD800a', '', 4],
    ['a\uD800', 'a\uD800', 0, 4],
    ['a\uD800', 'a', 0, 3],
    ['a\uD800', 'a', 0, 2],
    ['a\uD800', 'a', 0, 1],
    ['a\uD800', '', 0, 0],

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
  ],
  /* eslint-enable no-magic-numbers */
  ({ title }, [input, output, byteStart, byteEnd]) => {
    test(`String slice | ${title}`, (t) => {
      t.is(stringByteSlice(input, byteStart, byteEnd), output)
    })
  },
)
