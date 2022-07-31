// If the slice leaves some character partially cut, those are omitted.
// Uses `string.charCodeAt()` over `String.codePointAt()` because it is faster.
// Uses imperative code for performance.
/* eslint-disable complexity, max-statements, fp/no-let, fp/no-loops, max-depth,
   fp/no-mutation, no-continue, unicorn/prefer-code-point */
export const byteToCharForward = function (string, targetByteIndex, isEnd) {
  let charIndex = 0
  let previousCharIndex = charIndex
  let byteIndex = 0
  const increment = 1

  for (; byteIndex < targetByteIndex; charIndex += increment) {
    previousCharIndex = charIndex
    const codepoint = string.charCodeAt(charIndex)

    if (Number.isNaN(codepoint)) {
      break
    }

    if (codepoint <= LAST_ASCII_CODEPOINT) {
      byteIndex += 1
      continue
    }

    if (codepoint <= LAST_TWO_BYTES_CODEPOINT) {
      byteIndex += 2
      continue
    }

    byteIndex += 3

    if (codepoint < FIRST_LOW_SURROGATE || codepoint > LAST_LOW_SURROGATE) {
      continue
    }

    const nextCodepoint = string.charCodeAt(charIndex + increment)

    // Low surrogates should be followed by high surrogates.
    // However, JavaScript strings allow invalid surrogates, which are counted
    // as a normal 3-byte character. This should not happen often in real code
    // though.
    if (
      Number.isNaN(nextCodepoint) ||
      nextCodepoint < FIRST_HIGH_SURROGATE ||
      nextCodepoint > LAST_HIGH_SURROGATE
    ) {
      continue
    }

    byteIndex += 1
    charIndex += increment
  }

  return isEnd && byteIndex > targetByteIndex ? previousCharIndex : charIndex
}

// Last ASCII character (1 byte)
const LAST_ASCII_CODEPOINT = 0x7f
// Last 2-bytes character
const LAST_TWO_BYTES_CODEPOINT = 0x7_ff
// Others are 3 bytes characters
// However, U+d800 to U+dbff:
//  - Followed by U+dc00 to U+dfff -> 4 bytes together (astral character)
//  - Otherwise -> 3 bytes (like above)
const FIRST_LOW_SURROGATE = 0xd8_00
const LAST_LOW_SURROGATE = 0xdb_ff
const FIRST_HIGH_SURROGATE = 0xdc_00
const LAST_HIGH_SURROGATE = 0xdf_ff
/* eslint-enable complexity, max-statements, fp/no-let, fp/no-loops, max-depth,
   fp/no-mutation, no-continue, unicorn/prefer-code-point */
