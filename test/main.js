import test from 'ava'
import stringByteSlice from 'string-byte-slice'

test('Positive start, positive end', (t) => {
  t.is(stringByteSlice('abcd', 1, 3), 'bc')
})

test('Positive start, negative end', (t) => {
  t.is(stringByteSlice('abcd', 1, -1), 'bc')
})

test('Missing end index', (t) => {
  t.is(stringByteSlice('abcd', 1), 'bcd')
})

test('Large start positive index', (t) => {
  t.is(stringByteSlice('abcd', 10), '')
})

test('Large start negative index', (t) => {
  t.is(stringByteSlice('abcd', -10), '')
})

test('Large end positive index', (t) => {
  t.is(stringByteSlice('abcd', 0, 10), 'abcd')
})

test('Large end negative index', (t) => {
  t.is(stringByteSlice('abcd', 0, -10), 'abcd')
})
