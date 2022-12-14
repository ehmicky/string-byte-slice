// Normalize byte start index
export const getByteStart = (buffer, bufferLength, byteStart) => {
  const byteStartA = convertNegativeIndex(bufferLength, byteStart)
  return findByteStart(buffer, bufferLength, byteStartA)
}

// If the slice starts in the middle of a multibyte sequence, we trim it.
const findByteStart = (buffer, bufferLength, byteStart) => {
  if (byteStart >= bufferLength) {
    return byteStart
  }

  const byte = buffer[byteStart]
  return byte >= NEXT_BYTES_START && byte <= NEXT_BYTES_END
    ? findByteStart(buffer, bufferLength, byteStart + 1)
    : byteStart
}

// Normalize byte end index
export const getByteEnd = (buffer, bufferLength, byteEnd) => {
  if (byteEnd === undefined) {
    return byteEnd
  }

  const byteEndA = convertNegativeIndex(bufferLength, byteEnd)
  return findByteEnd(buffer, byteEndA)
}

// If the slice ends in the middle of a multibyte sequence, we trim it.
const findByteEnd = (buffer, byteEndA) => {
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

const isInvalid4Sequence = (buffer, byteEnd) =>
  byteEnd >= 3 &&
  buffer[byteEnd - 3] >= FIRST_BYTE_4_START &&
  buffer[byteEnd - 3] <= FIRST_BYTE_4_END

const isInvalid3Sequence = (buffer, byteEnd) =>
  byteEnd >= 2 && buffer[byteEnd - 2] >= FIRST_BYTE_3_START

const isInvalid2Sequence = (buffer, byteEnd) =>
  byteEnd >= 1 && buffer[byteEnd - 1] >= FIRST_BYTE_2_START

const convertNegativeIndex = (bufferLength, byteIndex) =>
  byteIndex < 0 || Object.is(byteIndex, -0)
    ? Math.max(bufferLength + byteIndex, 0)
    : byteIndex

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
