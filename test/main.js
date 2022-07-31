import test from 'ava'
import stringByteSlice from 'string-byte-slice'
import { each } from 'test-each'

each(
  /* eslint-disable no-magic-numbers */
  [
    // Normal positive indices
    ['abcd', 'bcd', 1],
    ['abc', 'abc', 0, 3],

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

    // 2-bytes characters
    ['\u00B1a', '\u00B1a', 0],
    ['\u00B1a', 'a', 1],
    ['\u00B1a', 'a', 2],
    ['\u00B1a', '', 3],
    ['a\u00B1', 'a\u00B1', 0, 3],
    ['a\u00B1', 'a', 0, 2],
    ['a\u00B1', 'a', 0, 1],
    ['a\u00B1', '', 0, 0],
  ],
  /* eslint-enable no-magic-numbers */
  ({ title }, [input, output, byteStart, byteEnd]) => {
    test(`String slice | ${title}`, (t) => {
      t.is(stringByteSlice(input, byteStart, byteEnd), output)
    })
  },
)
