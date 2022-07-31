import { byteToCharForward, byteToCharBackward } from './indices.js'
import { validateInput } from './validate.js'

export default function stringByteSlice(string, byteStart, byteEnd) {
  validateInput(string, byteStart, byteEnd)

  if (string === '') {
    return ''
  }

  const charStart = byteToChar(string, byteStart, false)
  const charEnd = getByteEnd(string, byteEnd)
  return charStart === 0 && charEnd === undefined
    ? string
    : string.slice(charStart, charEnd)
}

const getByteEnd = function (string, byteEnd) {
  if (byteEnd === undefined) {
    return byteEnd
  }

  const charEnd = byteToChar(string, byteEnd, true)
  return charEnd === string.length ? undefined : charEnd
}

// Unlike `string.slice()`, `-0` is not handled the same as `+0` since it is
// more useful
const byteToChar = function (string, byteIndex, isStart) {
  return byteIndex < 0 || Object.is(byteIndex, -0)
    ? byteToCharBackward(string, byteIndex, isStart)
    : byteToCharForward(string, byteIndex, isStart)
}
