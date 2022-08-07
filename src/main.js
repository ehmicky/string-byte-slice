import { byteToChar } from './direction.js'
import { replaceInvalidSurrogate } from './surrogate.js'
import { validateInput } from './validate.js'

// Like `string.slice()` but bytewise
export default function stringByteSlice(string, byteStart, byteEnd) {
  validateInput(string, byteStart, byteEnd)

  if (string === '') {
    return ''
  }

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
