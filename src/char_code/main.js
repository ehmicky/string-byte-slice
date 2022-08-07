import { replaceInvalidSurrogate } from '../surrogate.js'

import { byteToChar } from './direction.js'

// Variant that slices by iterating over the string using `String.charCode()`
export const charCodeSlice = function (string, byteStart, byteEnd) {
  const charStart = byteToChar(string, byteStart, false)
  const charEnd = getByteEnd(string, byteEnd)
  const stringA =
    charStart === 0 && charEnd === undefined
      ? string
      : string.slice(charStart, charEnd)
  return replaceInvalidSurrogate(stringA)
}

const getByteEnd = function (string, byteEnd) {
  if (byteEnd === undefined) {
    return byteEnd
  }

  const charEnd = byteToChar(string, byteEnd, true)
  return charEnd === string.length ? undefined : charEnd
}
