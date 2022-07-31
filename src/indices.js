// Uses `string.charCodeAt()` over `String.codePointAt()` because it is faster.
// Uses imperative code for performance.
/* eslint-disable complexity, max-statements, fp/no-let, fp/no-loops, max-depth,
   fp/no-mutation, no-magic-numbers, unicorn/prefer-code-point */
export const byteToCharForward = function (string, targetByteIndex, isStart) {
  const charLength = string.length
  let charIndex = 0
  let byteIndex = 0
  let hasSurrogate = false

  for (
    ;
    byteIndex < targetByteIndex && charIndex < charLength;
    charIndex += 1
  ) {
    const codepoint = string.charCodeAt(charIndex)

    // ASCII characters -> 1 byte
    if (codepoint < 0x80) {
      byteIndex += 1
      hasSurrogate = false
      // U+0080 to U+07ff -> 2 bytes
    } else if (codepoint < 0x8_00) {
      byteIndex += 2
      hasSurrogate = false
      // Astral character
    } else if (hasSurrogate && codepoint >= 0xdc_00 && codepoint <= 0xdf_ff) {
      byteIndex += 1
      hasSurrogate = false
      // U+0800 to U+ffff -> 3 bytes
      // However, U+d800 to U+dbff:
      //  - Followed by U+dc00 to U+dfff -> 4 bytes together (astral character)
      //  - Otherwise -> 3 bytes (like above)
    } else {
      byteIndex += 3
      hasSurrogate = codepoint >= 0xd8_00 && codepoint <= 0xdb_ff
    }
  }

  if (charIndex < charLength) {
    const nextCodePoint = string.charCodeAt(charIndex + 1)

    if (hasSurrogate && nextCodePoint >= 0xdc_00 && nextCodePoint <= 0xdf_ff) {
      byteIndex += 1
      charIndex += 1
      hasSurrogate = false
    }
  }

  return isStart || byteIndex <= targetByteIndex ? charIndex : charIndex - 1
}
/* eslint-enable complexity, max-statements, fp/no-let, fp/no-loops, max-depth,
   fp/no-mutation, no-magic-numbers, unicorn/prefer-code-point */
