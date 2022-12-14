import test from 'ava'
import { each } from 'test-each'

import stringByteSlice from 'string-byte-slice'

each(
  [
    [],
    [true],
    [''],
    ['', true],
    // eslint-disable-next-line no-magic-numbers
    ['', 0.5],
    ['', '1'],
    ['', Number.NaN],
    ['', 0, true],
    // eslint-disable-next-line no-magic-numbers
    ['', 0, 0.5],
    ['', 0, '1'],
    ['', 0, Number.NaN],
  ],
  ({ title }, args) => {
    test(`Arguments are validated | ${title}`, (t) => {
      t.throws(stringByteSlice.bind(undefined, ...args))
    })
  },
)
