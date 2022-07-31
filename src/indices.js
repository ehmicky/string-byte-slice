// Convert positive byteIndex argument to a charIndex
export const byteToCharForward = function (string, targetByteIndex, isEnd) {
  return byteToChar({
    string,
    targetByteIndex,
    firstStartSurrogate: FIRST_LOW_SURROGATE,
    lastStartSurrogate: LAST_LOW_SURROGATE,
    firstEndSurrogate: FIRST_HIGH_SURROGATE,
    lastEndSurrogate: LAST_HIGH_SURROGATE,
    increment: 1,
    canBacktrack: isEnd,
    shift: 0,
    charIndexInit: 0,
  })
}

// Convert negative byteIndex argument to a charIndex
export const byteToCharBackward = function (string, targetByteIndex, isEnd) {
  return byteToChar({
    string,
    targetByteIndex,
    firstStartSurrogate: FIRST_HIGH_SURROGATE,
    lastStartSurrogate: LAST_HIGH_SURROGATE,
    firstEndSurrogate: FIRST_LOW_SURROGATE,
    lastEndSurrogate: LAST_LOW_SURROGATE,
    increment: -1,
    canBacktrack: !isEnd,
    shift: 1,
    charIndexInit: string.length - 1,
  })
}

// Find the character index where to slice the string based on the amount of
// bytes passed as argument.
// Works both forward|backward for positive|negative arguments.
// If the slice leaves some character partially cut, those are omitted.
// Uses `string.charCodeAt()` over `String.codePointAt()` because it is faster.
// Uses imperative code for performance.
/* eslint-disable complexity, max-statements, fp/no-let, fp/no-loops, max-depth,
   fp/no-mutation, no-continue, unicorn/prefer-code-point */
export const byteToChar = function ({
  string,
  targetByteIndex,
  firstStartSurrogate,
  lastStartSurrogate,
  firstEndSurrogate,
  lastEndSurrogate,
  increment,
  canBacktrack,
  shift,
  charIndexInit,
}) {
  let charIndex = charIndexInit
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

  const finalCharIndex =
    canBacktrack && byteIndex > targetByteIndex ? previousCharIndex : charIndex
  return finalCharIndex + shift
}
/* eslint-enable complexity, max-statements, fp/no-let, fp/no-loops, max-depth,
   fp/no-mutation, no-continue, unicorn/prefer-code-point */

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
