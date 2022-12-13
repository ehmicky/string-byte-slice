import { getByteStart, getByteEnd } from './bytes.js'

// Uses `Buffer.from().toString()` to slice a string byte-wise.
export const bufferSlice = (input, byteStart, byteEnd) => {
  // eslint-disable-next-line n/prefer-global/buffer
  const buffer = globalThis.Buffer.from(input)
  const byteStartA = getByteStart(buffer, buffer.length, byteStart)
  const byteEndA = getByteEnd(buffer, buffer.length, byteEnd)
  return byteStartA === 0 && byteEndA >= buffer.length
    ? buffer.toString()
    : buffer.toString('utf8', byteStartA, byteEndA)
}
