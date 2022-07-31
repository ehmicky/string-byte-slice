import { byteToChar } from './indices.js'
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
