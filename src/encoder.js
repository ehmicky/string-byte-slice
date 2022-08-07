import { getByteStart, getByteEnd } from './bytes.js'

// Uses `TextEncoder` to slice a string byte-wise.
export const textEncoderSlice = function (input, byteStart, byteEnd) {
  const { textEncoder, textDecoder } = getEncoderDecoder()
  const buffer = getBuffer(input)
  const { written } = textEncoder.encodeInto(input, buffer)
  const byteStartA = getByteStart(buffer, written, byteStart)
  const byteEndA = getByteEnd(buffer, written, byteEnd)
  const byteEndB =
    byteEndA === undefined ? written : Math.min(byteEndA, written)
  const bufferA = buffer.subarray(byteStartA, byteEndB)
  return textDecoder.decode(bufferA)
}

// Those global variables are not available in all environments, so we create
// them at runtime then cache them
const getEncoderDecoder = function () {
  if (textEncoderCache === undefined) {
    // eslint-disable-next-line fp/no-mutation
    textEncoderCache = new globalThis.TextEncoder()
    // eslint-disable-next-line fp/no-mutation
    textDecoderCache = new globalThis.TextDecoder('utf8', { fatal: false })
  }

  return { textEncoder: textEncoderCache, textDecoder: textDecoderCache }
}

// eslint-disable-next-line fp/no-let, init-declarations
let textEncoderCache
// eslint-disable-next-line fp/no-let, init-declarations
let textDecoderCache

// The buffer is cached for performance reason
const getBuffer = function (input) {
  const size = input.length * 3

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
