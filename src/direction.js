import {
  FIRST_LOW_SURROGATE,
  LAST_LOW_SURROGATE,
  FIRST_HIGH_SURROGATE,
  LAST_HIGH_SURROGATE,
} from './codepoints.js'
import { findCharIndex } from './indices.js'

// Convert `byteIndex` to `charIndex`.
// Unlike `string.slice()`, `-0` is not handled the same as `+0` since it is
// more useful.
export const byteToChar = function (string, byteIndex, isStart) {
  return byteIndex < 0 || Object.is(byteIndex, -0)
    ? byteToCharBackward(string, byteIndex, isStart)
    : byteToCharForward(string, byteIndex, isStart)
}

// Convert positive byteIndex argument to a charIndex
const byteToCharForward = function (string, byteIndex, isEnd) {
  return findCharIndex({
    string,
    targetByteCount: byteIndex,
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
const byteToCharBackward = function (string, byteIndex, isEnd) {
  return findCharIndex({
    string,
    targetByteCount: -byteIndex,
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
