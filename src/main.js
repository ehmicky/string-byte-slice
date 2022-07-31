import { validateInput } from './validate.js'

export default function stringByteSlice(string, byteStart, byteEnd) {
  validateInput(string, byteStart, byteEnd)
  const charStart = byteToChar(string, byteStart)
  const charEnd = getByteEnd(string, byteEnd)
  return string.slice(charStart, charEnd)
}

const getByteEnd = function (string, byteEnd) {
  return byteEnd === undefined ? byteEnd : byteToChar(string, byteEnd)
}

// `-0` should be handled the same as `+0` to mimic `string.slice()`
const byteToChar = function (string, byteIndex) {
  return byteIndex < 0
    ? byteToCharBackward(string, byteIndex)
    : byteToCharForward(string, byteIndex)
}

const byteToCharForward = function (string, byteIndex) {
  return byteIndex
}

const byteToCharBackward = function (string, byteIndex) {
  return Math.max(string.length - byteIndex, 0)
}
