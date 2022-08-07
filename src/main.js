import { bufferSlice } from './buffer.js'
import { charCodeSlice } from './char_code.js'
import { LAST_ASCII_CODEPOINT } from './codepoints.js'
import { textEncoderSlice } from './encoder.js'
import { validateInput } from './validate.js'

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
const useBestSlice = function (string, byteStart, byteEnd) {
  if (string.length <= CHAR_CODE_MIN_LENGTH) {
    return charCodeSlice(string, byteStart, byteEnd)
  }

  const asciiPercentage = getAsciiPercentage(string)

  if (asciiPercentage >= BUFFER_CODE_MIN_PERC) {
    return tryBufferSlice(string, byteStart, byteEnd)
  }

  return asciiPercentage >= CHAR_CODE_MIN_PERC
    ? charCodeSlice(string, byteStart, byteEnd)
    : tryTextEncoderSlice(string, byteStart, byteEnd)
}

// On small strings, `charCode()` tends to be the fastest variant.
// Note: if this number was to be lower than `SAMPLE_SIZE`, the estimation logic
// should be changed.
const CHAR_CODE_MIN_LENGTH = 2e2
// When the strings has only ASCII characters, `Buffer.from()` tends to be
// the fastest variant.
const BUFFER_CODE_MIN_PERC = 1
// When the strings has mostly non-ASCII characters, `charCode()` tends to be
// the fastest variant.
// This is the minimum threshold.
const CHAR_CODE_MIN_PERC = 0.3

// The performance varies depending on how many characters are ASCII or not.
// This estimates it by using a sample of the first 100 characters.
// TODO: use a stride instead
// Uses imperative logic for performance
/* eslint-disable fp/no-let, fp/no-loops, fp/no-mutation, max-depth */
const getAsciiPercentage = function (string) {
  let asciiPercentage = 0

  for (let index = 0; index < SAMPLE_SIZE; index += 1) {
    const codepoint = string.codePointAt(index)

    if (codepoint <= LAST_ASCII_CODEPOINT) {
      asciiPercentage += 1
    }
  }

  return asciiPercentage / SAMPLE_SIZE
}
/* eslint-enable fp/no-let, fp/no-loops, fp/no-mutation, max-depth */

const SAMPLE_SIZE = 1e2

const tryBufferSlice = function (string, byteStart, byteEnd) {
  // eslint-disable-next-line n/prefer-global/buffer
  return 'Buffer' in globalThis && 'from' in globalThis.Buffer
    ? bufferSlice(string, byteStart, byteEnd)
    : tryTextEncoderSlice(string, byteStart, byteEnd)
}

const tryTextEncoderSlice = function (string, byteStart, byteEnd) {
  return 'TextEncoder' in globalThis
    ? textEncoderSlice(string, byteStart, byteEnd)
    : charCodeSlice(string, byteStart, byteEnd)
}
