import { charCodeSlice } from './char_code.js'
import { validateInput } from './validate.js'

// Like `string.slice()` but bytewise
export default function stringByteSlice(string, byteStart, byteEnd) {
  validateInput(string, byteStart, byteEnd)

  if (string === '') {
    return ''
  }

  return charCodeSlice(string, byteStart, byteEnd)
}
