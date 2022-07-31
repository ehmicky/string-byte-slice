import test from 'ava'
import stringByteSlice from 'string-byte-slice'
import { each } from 'test-each'

each(
  /* eslint-disable no-magic-numbers */
  [
    ['abcd', 'bc', 1, 3],
    ['abcd', 'bc', 1, -1],
    ['abcd', 'bc', -3, 3],
    ['abcd', 'bc', -3, -1],
    ['abcd', 'bcd', 1],
    ['abcd', '', 10],
    ['abcd', '', 0, -10],
    ['abcd', 'abcd', -10],
    ['abcd', 'abcd', 0, 10],
    ['', '', 0],
    ['\u00B1bc\u00B1', '\u00B1bc\u00B1', 0],
    ['\u00B1bc\u00B1', '\u00B1bc', 0, 5],
    ['\u00B1bc\u00B1', 'bc', 1, 5],
    ['\u00B1bc\u00B1', 'bc', 2, 5],
    ['\u00B1bc\u00B1', 'c', 3, 5],
    ['\u00B1bc\u00B1', '', 4, 5],
    ['\u00B1bc\u00B1', '\u00B1bc', 0, 4],
    ['\u00B1bc\u00B1', '\u00B1b', 0, 3],
    ['\u00B1bc\u00B1', '\u00B1', 0, 2],
    ['\u00B1bc\u00B1', '', 0, 1],
  ],
  /* eslint-enable no-magic-numbers */
  ({ title }, [input, output, byteStart, byteEnd]) => {
    test(`String slice | ${title}`, (t) => {
      t.is(stringByteSlice(input, byteStart, byteEnd), output)
    })
  },
)
