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

const getByteStart = function (buffer, byteStart) {
  const byteStartA = convertNegativeIndex(buffer, byteStart)
  return findByteStart(buffer, byteStartA)
}

// If the slice starts in the middle of a multibyte sequence, we trim it.
const findByteStart = function (buffer, byteStart) {
  if (byteStart >= buffer.length) {
    return byteStart
  }

  const byte = buffer[byteStart]
  return byte >= NEXT_BYTES_START && byte <= NEXT_BYTES_END
    ? findByteStart(buffer, byteStart + 1)
    : byteStart
}

const getByteEnd = function (buffer, byteEnd) {
  if (byteEnd === undefined) {
    return byteEnd
  }

  const byteEndA = convertNegativeIndex(buffer, byteEnd)
  return findByteEnd(buffer, byteEndA)
}

// If the slice ends in the middle of a multibyte sequence, we trim it.
const findByteEnd = function (buffer, byteEndA) {
  if (isInvalid4Sequence(buffer, byteEndA)) {
    return byteEndA - 3
  }

  if (isInvalid3Sequence(buffer, byteEndA)) {
    return byteEndA - 2
  }

  if (isInvalid2Sequence(buffer, byteEndA)) {
    return byteEndA - 1
  }

  return byteEndA
}

const isInvalid4Sequence = function (buffer, byteEnd) {
  return (
    byteEnd >= 3 &&
    buffer[byteEnd - 3] >= FIRST_BYTE_4_START &&
    buffer[byteEnd - 3] <= FIRST_BYTE_4_END
  )
}

const isInvalid3Sequence = function (buffer, byteEnd) {
  return byteEnd >= 2 && buffer[byteEnd - 2] >= FIRST_BYTE_3_START
}

const isInvalid2Sequence = function (buffer, byteEnd) {
  return byteEnd >= 1 && buffer[byteEnd - 1] >= FIRST_BYTE_2_START
}

const convertNegativeIndex = function (buffer, byteIndex) {
  return byteIndex < 0 || Object.is(byteIndex, -0)
    ? Math.max(buffer.length + byteIndex, 0)
    : byteIndex
}

// The first byte of a UTF-8 4-bytes sequence are between those.
const FIRST_BYTE_4_START = 0xf0
const FIRST_BYTE_4_END = 0xf4
// The first byte of a UTF-8 3-bytes sequence is at least this
const FIRST_BYTE_3_START = 0xe0
// The first byte of a UTF-8 3-bytes sequence is at least this
const FIRST_BYTE_2_START = 0xc2
// The non-first bytes of a UTF-8 multibyte sequence are between those.
// Note:
//  - if the first byte is 0xe0, the second byte is at least 0xa0
//  - if the first byte is 0xf0, the second byte is at least 0x90
//  - however, this does not impact the logic above
const NEXT_BYTES_START = 0x80
const NEXT_BYTES_END = 0xbf
