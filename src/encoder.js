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

  const buffer = getBuffer(string)
  const { written } = textEncoder.encodeInto(string, buffer)
  const byteStartA = getByteStart(buffer, written, byteStart)
  const byteEndA = getByteEnd(buffer, written, byteEnd)
  const byteEndB =
    byteEndA === undefined ? written : Math.min(byteEndA, written)
  const bufferA = buffer.slice(byteStartA, byteEndB)
  return textDecoder.decode(bufferA)
}

// The buffer is cached for performance reason
const getBuffer = function (string) {
  const size = string.length * 3

  if (size > CACHE_MAX_MEMORY) {
    return new Uint8Array(size)
  }

  if (cachedEncoderBuffer === undefined || cachedEncoderBuffer.length < size) {
    // eslint-disable-next-line fp/no-mutation
    cachedEncoderBuffer = new Uint8Array(size)
  }

  return cachedEncoderBuffer
}

// Maximum amount of memory (in bytes) taken by cached buffer
export const CACHE_MAX_MEMORY = 1e5
// eslint-disable-next-line fp/no-let, init-declarations
let cachedEncoderBuffer
