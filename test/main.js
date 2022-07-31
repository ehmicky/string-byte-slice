import test from 'ava'
import stringByteSlice from 'string-byte-slice'
import { each } from 'test-each'

each(
  [
    { input: 'abcd', output: 'bc', byteStart: 1, byteEnd: 3 },
    { input: 'abcd', output: 'bc', byteStart: 1, byteEnd: -1 },
    { input: 'abcd', output: 'bc', byteStart: -3, byteEnd: 3 },
    { input: 'abcd', output: 'bc', byteStart: -3, byteEnd: -1 },
    { input: 'abcd', output: 'bcd', byteStart: 1 },
    { input: 'abcd', output: '', byteStart: 10 },
    { input: 'abcd', output: '', byteStart: 0, byteEnd: -10 },
    { input: 'abcd', output: 'abcd', byteStart: -10 },
    { input: 'abcd', output: 'abcd', byteStart: 0, byteEnd: 10 },
    { input: '', output: '', byteStart: 0 },
    { input: '\u00B1bc\u00B1', output: '\u00B1bc', byteStart: 0, byteEnd: 4 },
    { input: '\u00B1bc\u00B1', output: 'bc', byteStart: 1, byteEnd: 4 },
    { input: '\u00B1bc\u00B1', output: 'bc', byteStart: 2, byteEnd: 4 },
  ],
  ({ title }, { input, output, byteStart, byteEnd }) => {
    test(`String slice | ${title}`, (t) => {
      t.is(stringByteSlice(input, byteStart, byteEnd), output)
    })
  },
)
