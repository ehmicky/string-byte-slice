import { LAST_ASCII_CODEPOINT, LAST_TWO_BYTES_CODEPOINT } from './codepoints.js'

// The performance varies depending on the UTF-8 length of characters.
// This estimates it by using a sample.
// We stride through the whole string to give a better representation of it.
//  - We make sure the first character is included since it might be a BOM
// Uses imperative logic for performance.
/* eslint-disable fp/no-let, fp/no-loops, fp/no-mutation, max-depth,
   complexity, max-statements, no-continue */
export const estimateCharWidth = function (input) {
  let asciiOnly = true
  let longCharsCount = 0

  for (let index = 0; index < SAMPLE_SIZE; index += 1) {
    const codepoint = getCodepoint(input, index)

    if (codepoint <= LAST_ASCII_CODEPOINT) {
      continue
    }

    if (asciiOnly) {
      asciiOnly = false
    }

    if (codepoint > LAST_TWO_BYTES_CODEPOINT) {
      longCharsCount += 1
    }
  }

  return { asciiOnly, longCharsPercentage: longCharsCount / SAMPLE_SIZE }
}
/* eslint-enable fp/no-let, fp/no-loops, fp/no-mutation, max-depth,
   complexity, max-statements, no-continue */

const getCodepoint = function (input, index) {
  const sampleSize = SAMPLE_SIZE - 1
  const percentage = 1 - (sampleSize - index) / sampleSize
  const charIndex = Math.round(percentage * (input.length - 1))
  // eslint-disable-next-line unicorn/prefer-code-point
  return input.charCodeAt(charIndex)
}

// How many characters to sample.
// A higher number is slower.
// A lower number results in a more imprecise estimate.
const SAMPLE_SIZE = 50
