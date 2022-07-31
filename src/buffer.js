import { Buffer } from 'buffer'

import { getByteStart, getByteEnd } from './bytes.js'
import { validateInput } from './validate.js'

// Uses `Buffer.from().toString()` to slice a string byte-wise.
// Note: `Buffer.from()` converts invalid surrogates to U+fffd.
export const stringByteSliceBuffer = function (string, byteStart, byteEnd) {
  validateInput(string, byteStart, byteEnd)

  if (string === '') {
    return ''
  }

  const buffer = Buffer.from(string)
  const byteStartA = getByteStart(buffer, buffer.length, byteStart)
  const byteEndA = getByteEnd(buffer, buffer.length, byteEnd)
  return buffer.toString('utf8', byteStartA, byteEndA)
}
