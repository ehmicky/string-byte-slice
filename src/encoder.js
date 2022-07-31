import { getByteStart, getByteEnd } from './bytes.js'
import { validateInput } from './validate.js'

// Uses `TextEncoder` to slice a string byte-wise.
// Note: `encode()` converts invalid surrogates to U+fffd.
export const createEncoder = function () {
  return stringByteSliceEncoder.bind(
    undefined,
    new TextEncoder(),
    new TextDecoder('utf8', { fatal: false }),
  )
}

// eslint-disable-next-line max-params
const stringByteSliceEncoder = function (
  textEncoder,
  textDecoder,
  string,
  byteStart,
  byteEnd,
) {
  validateInput(string, byteStart, byteEnd)

  if (string === '') {
    return ''
  }

  const buffer = textEncoder.encode(string)
  const byteStartA = getByteStart(buffer, byteStart)
  const byteEndA = getByteEnd(buffer, byteEnd)
  const bufferA = buffer.slice(byteStartA, byteEndA)
  return textDecoder.decode(bufferA)
}
