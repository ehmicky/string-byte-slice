// If the slice leaves some character partially cut, those are omitted.
// Uses `string.charCodeAt()` over `String.codePointAt()` because it is faster.
// Uses imperative code for performance.
/* eslint-disable complexity, max-statements, fp/no-let, fp/no-loops, max-depth,
   fp/no-mutation, no-continue, unicorn/prefer-code-point */
export const byteToCharBackward = function (string, targetByteIndex, isEnd) {
  const firstStartSurrogate = FIRST_HIGH_SURROGATE
  const lastStartSurrogate = LAST_HIGH_SURROGATE
  const firstEndSurrogate = FIRST_LOW_SURROGATE
  const lastEndSurrogate = LAST_LOW_SURROGATE
  const increment = -1
  const canBacktrack = !isEnd
  let charIndex = string.length - 1
  let previousCharIndex = charIndex
  let byteIndex = 0

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

    if (codepoint < firstStartSurrogate || codepoint > lastStartSurrogate) {
      continue
    }

    const nextCodepoint = string.charCodeAt(charIndex + increment)

    // Low surrogates should be followed by high surrogates.
    // However, JavaScript strings allow invalid surrogates, which are counted
    // as a normal 3-byte character. This should not happen often in real code
    // though.
    if (
      Number.isNaN(nextCodepoint) ||
      nextCodepoint < firstEndSurrogate ||
      nextCodepoint > lastEndSurrogate
    ) {
      continue
    }

    byteIndex += 1
    charIndex += increment
  }

  return (
    (canBacktrack && byteIndex > targetByteIndex
      ? previousCharIndex
      : charIndex) + 1
  )
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
