import { bufferSlice } from './buffer.js'
import { charCodeSlice } from './char_code.js'
import { textEncoderSlice } from './encoder.js'
import { validateInput } from './validate.js'
import { estimateCharWidth } from './width.js'

// Like `string.slice()` but bytewise
export default function stringByteSlice(string, byteStart, byteEnd) {
  validateInput(string, byteStart, byteEnd)

  if (string === '') {
    return ''
  }

  return useBestSlice(string, byteStart, byteEnd)
}

// Which is the fastest algorithm depends on:
//  - The string length
//  - How many characters are ASCII in the string
// Specifically:
//  - `charCode()` is the fastest either:
//     - On small strings
//     - when the string has mostly 3 or 4-UTF8-bytes-long characters
//  - `Buffer.from()` is the fastest when the string has only ASCII characters
const useBestSlice = function (string, byteStart, byteEnd) {
  if (string.length <= CHAR_CODE_MIN_LENGTH) {
    return charCodeSlice(string, byteStart, byteEnd)
  }

  const { asciiOnly, longCharsPercentage } = estimateCharWidth(string)

  if (asciiOnly) {
    return tryBufferSlice(string, byteStart, byteEnd)
  }

  return longCharsPercentage >= CHAR_CODE_MIN_PERC
    ? charCodeSlice(string, byteStart, byteEnd)
    : tryTextEncoderSlice(string, byteStart, byteEnd)
}

// Under this `string.length`, `charCode()` is preferred
// Note: if this number was to be lower than `SAMPLE_SIZE`, the estimation logic
// should be changed.
const CHAR_CODE_MIN_LENGTH = 2e2
// Above that percentage of long characters, `charCode()` is preferred
const CHAR_CODE_MIN_PERC = 0.4

// `Buffer` is only available in Node.js
const tryBufferSlice = function (string, byteStart, byteEnd) {
  // eslint-disable-next-line n/prefer-global/buffer
  return 'Buffer' in globalThis && 'from' in globalThis.Buffer
    ? bufferSlice(string, byteStart, byteEnd)
    : tryTextEncoderSlice(string, byteStart, byteEnd)
}

// `TextEncoder` is usually available, except in some rare cases
const tryTextEncoderSlice = function (string, byteStart, byteEnd) {
  return 'TextEncoder' in globalThis
    ? textEncoderSlice(string, byteStart, byteEnd)
    : charCodeSlice(string, byteStart, byteEnd)
}
