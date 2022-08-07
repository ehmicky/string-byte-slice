import { bufferSlice } from '../src/buffer.js'
import { charCodeSlice } from '../src/char_code.js'
import { textEncoderSlice } from '../src/encoder.js'

import { getArgs } from './args.js'

/* eslint-disable fp/no-mutation, fp/no-let, prefer-destructuring */
const beforeAll = function ({ character, slice, size }) {
  const args = getArgs(character, slice, size)
  string = args.string
  byteStart = args.byteStart
  byteEnd = args.byteEnd
}

let string = ''
let byteStart = 0
let byteEnd = 0
/* eslint-enable fp/no-mutation, fp/no-let, prefer-destructuring */

export const charCodeAt = {
  beforeAll,
  main() {
    charCodeSlice(string, byteStart, byteEnd)
  },
}

export const bufferFrom = {
  beforeAll,
  main() {
    bufferSlice(string, byteStart, byteEnd)
  },
}

export const textEncoder = {
  beforeAll,
  main() {
    textEncoderSlice(string, byteStart, byteEnd)
  },
}