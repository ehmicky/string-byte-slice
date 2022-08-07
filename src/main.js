import { bufferSlice } from './buffer.js'
import { charCodeSlice } from './char_code/main.js'
import { textEncoderSlice } from './encoder.js'
import { normalizeByteEnd, normalizeByteIndex } from './normalize.js'
import { replaceInvalidSurrogate } from './surrogate.js'
import { validateInput } from './validate.js'
import { estimateCharWidth } from './width.js'

// Like `string.slice()` but bytewise
export default function stringByteSlice(input, byteStart, byteEnd) {
  validateInput(input, byteStart, byteEnd)

  if (input === '') {
    return input
  }

  const byteStartA = normalizeByteIndex(input, byteStart)
  const byteEndA = normalizeByteEnd(input, byteEnd)

  if (byteEndA === undefined && Object.is(byteStartA, 0)) {
    return replaceInvalidSurrogate(input)
  }

  return useBestSlice(input, byteStartA, byteEndA)
}

// Which is the fastest algorithm depends on:
//  - The `input` length
//  - How many characters are ASCII in the `input`
// Specifically:
//  - `charCode()` is the fastest either:
//     - On small strings
//     - when the string has mostly 3 or 4-UTF8-bytes-long characters
//  - `Buffer.from()` is the fastest when the string has only ASCII characters
const useBestSlice = function (input, byteStart, byteEnd) {
  if (input.length <= CHAR_CODE_MIN_LENGTH) {
    return charCodeSlice(input, byteStart, byteEnd)
  }

  const { asciiOnly, longCharsPercentage } = estimateCharWidth(input)

  if (asciiOnly) {
    return tryBufferSlice(input, byteStart, byteEnd)
  }

  return longCharsPercentage >= CHAR_CODE_MIN_PERC
    ? charCodeSlice(input, byteStart, byteEnd)
    : tryTextEncoderSlice(input, byteStart, byteEnd)
}

// Under this `input.length`, `charCode()` is preferred
// Note: if this number was to be lower than `SAMPLE_SIZE`, the estimation logic
// should be changed.
const CHAR_CODE_MIN_LENGTH = 2e2
// Above that percentage of long characters, `charCode()` is preferred
const CHAR_CODE_MIN_PERC = 0.4

// `Buffer` is only available in Node.js
const tryBufferSlice = function (input, byteStart, byteEnd) {
  /* c8 ignore start */
  // eslint-disable-next-line n/prefer-global/buffer
  return 'Buffer' in globalThis && 'from' in globalThis.Buffer
    ? bufferSlice(input, byteStart, byteEnd)
    : tryTextEncoderSlice(input, byteStart, byteEnd)
  /* c8 ignore stop */
}

// `TextEncoder` is usually available, except in some rare cases
const tryTextEncoderSlice = function (input, byteStart, byteEnd) {
  /* c8 ignore start */
  return 'TextEncoder' in globalThis
    ? textEncoderSlice(input, byteStart, byteEnd)
    : charCodeSlice(input, byteStart, byteEnd)
  /* c8 ignore stop */
}
