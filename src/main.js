import { byteToCharForward } from './indices.js'
import { validateInput } from './validate.js'

export default function stringByteSlice(string, byteStart, byteEnd) {
  validateInput(string, byteStart, byteEnd)

  if (string === '') {
    return ''
  }

  const charStart = byteToChar(string, byteStart, true)
  const charEnd = getByteEnd(string, byteEnd)
  return charStart === 0 && charEnd === undefined
    ? string
    : string.slice(charStart, charEnd)
}

const getByteEnd = function (string, byteEnd) {
  if (byteEnd === undefined) {
    return byteEnd
  }

  const charEnd = byteToChar(string, byteEnd, false)
  return charEnd === string.length ? undefined : charEnd
}

// `-0` should be handled the same as `+0` to mimic `string.slice()`
const byteToChar = function (string, byteIndex, isStart) {
  return byteIndex < 0
    ? byteToCharBackward(string, byteIndex, isStart)
    : byteToCharForward(string, byteIndex, isStart)
}

const byteToCharBackward = function (string, byteIndex) {
  return Math.max(string.length + byteIndex, 0)
}
