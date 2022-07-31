import { stringByteSliceBuffer } from '../src/buffer.js'
import { createEncoder } from '../src/encoder.js'
import stringByteSlice from '../src/main.js'

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
    stringByteSlice(string, byteStart, byteEnd)
  },
}

export const bufferFrom = {
  beforeAll,
  main() {
    stringByteSliceBuffer(string, byteStart, byteEnd)
  },
}

const stringByteSliceEncoder = createEncoder()
export const textEncoder = {
  beforeAll,
  main() {
    stringByteSliceEncoder(string, byteStart, byteEnd)
  },
}
