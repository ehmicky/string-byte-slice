import { Buffer } from 'buffer'

import { getByteStart, getByteEnd } from './bytes.js'

// Uses `Buffer.from().toString()` to slice a string byte-wise.
export const bufferSlice = function (string, byteStart, byteEnd) {
  const buffer = Buffer.from(string)
  const byteStartA = getByteStart(buffer, buffer.length, byteStart)
  const byteEndA = getByteEnd(buffer, buffer.length, byteEnd)
  return buffer.toString('utf8', byteStartA, byteEndA)
}
