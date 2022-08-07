import {
  LAST_ASCII_CODEPOINT,
  LAST_TWO_BYTES_CODEPOINT,
} from '../codepoints.js'

// Find the character index where to slice the `input` based on the amount of
// bytes passed as argument.
// Works both forward|backward for positive|negative arguments.
// If the slice leaves some character partially cut, those are omitted.
// Uses `string.charCodeAt()` over `string.codePointAt()` because it is faster.
// Uses imperative code for performance.
/* eslint-disable complexity, max-statements, fp/no-let, fp/no-loops, max-depth,
   fp/no-mutation, no-continue, unicorn/prefer-code-point */
export const findCharIndex = function ({
  input,
  targetByteCount,
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
  let byteCount = 0

  for (; byteCount < targetByteCount; charIndex += increment) {
    previousCharIndex = charIndex
    const codepoint = input.charCodeAt(charIndex)

    if (Number.isNaN(codepoint)) {
      break
    }

    if (codepoint <= LAST_ASCII_CODEPOINT) {
      byteCount += 1
      continue
    }

    if (codepoint <= LAST_TWO_BYTES_CODEPOINT) {
      byteCount += 2
      continue
    }

    byteCount += 3

    if (codepoint < firstStartSurrogate || codepoint > lastStartSurrogate) {
      continue
    }

    const nextCodepoint = input.charCodeAt(charIndex + increment)

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

    byteCount += 1
    charIndex += increment
  }

  const finalCharIndex =
    canBacktrack && byteCount > targetByteCount ? previousCharIndex : charIndex
  return finalCharIndex + shift
}
/* eslint-enable complexity, max-statements, fp/no-let, fp/no-loops, max-depth,
   fp/no-mutation, no-continue, unicorn/prefer-code-point */
