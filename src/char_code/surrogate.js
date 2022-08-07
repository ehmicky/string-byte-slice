import {
  FIRST_LOW_SURROGATE,
  LAST_HIGH_SURROGATE,
  SURROGATE_REGEXP,
  SURROGATE_REPLACE_CHAR,
} from '../codepoints.js'

// Both `Buffer.from()` and `TextEncoder.encode()` replace invalid surrogate
// characters to U+FFFD. However, `string.slice()` does not.
// To ensure that the different algorithms have the same output, we manually
// replace those after `string.slice()`.
// Since U+FFFD is a 3-byte character in UTF-8, just like isolated surrogate
// character, this does not impact slicing.
export const replaceInvalidSurrogate = function (string) {
  return hasSurrogates(string)
    ? string.replace(SURROGATE_REGEXP, SURROGATE_REPLACE_CHAR)
    : string
}

// Isolated surrogates should be rare. For performance reasons, we first check
// if there are any before doing any string replacement.
// Doing this check by iterating over the string is faster than using a RegExp.
const hasSurrogates = function (string) {
  // eslint-disable-next-line fp/no-loops, fp/no-mutation, fp/no-let
  for (let index = 0; index < string.length; index += 1) {
    const codepoint = string.codePointAt(index)

    // eslint-disable-next-line max-depth
    if (codepoint >= FIRST_LOW_SURROGATE && codepoint <= LAST_HIGH_SURROGATE) {
      return true
    }
  }

  return false
}
