import { replaceInvalidSurrogate } from '../surrogate.js'

import { byteToChar } from './direction.js'

// Variant that slices by iterating over the string using `String.charCode()`
export const charCodeSlice = function (input, byteStart, byteEnd) {
  const charStart = byteToChar(input, byteStart, false)
  const charEnd = getByteEnd(input, byteEnd)
  const inputA =
    charStart === 0 && charEnd === undefined
      ? input
      : input.slice(charStart, charEnd)
  return replaceInvalidSurrogate(inputA)
}

const getByteEnd = function (input, byteEnd) {
  if (byteEnd === undefined) {
    return byteEnd
  }

  const charEnd = byteToChar(input, byteEnd, true)
  return charEnd === input.length ? undefined : charEnd
}
