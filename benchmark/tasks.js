import stringByteSliceLib from 'string-byte-slice'

import { bufferSlice } from '../src/buffer.js'
import { charCodeSlice } from '../src/char_code/main.js'
import { textEncoderSlice } from '../src/encoder.js'

import { getArgs } from './args.js'


/* eslint-disable fp/no-mutation, fp/no-let, prefer-destructuring */
const beforeAll = (inputs) => {
  const args = getArgs(inputs)
  string = args.string
  byteStart = args.byteStart
  byteEnd = args.byteEnd
}

let string = ''
let byteStart = 0
let byteEnd = 0
/* eslint-enable fp/no-mutation, fp/no-let, prefer-destructuring */

export const stringByteSlice = {
  beforeAll,
  main: () => {
    stringByteSliceLib(string, byteStart, byteEnd)
  },
}

export const charCodeAt = {
  beforeAll,
  main: () => {
    charCodeSlice(string, byteStart, byteEnd)
  },
}

export const bufferFrom = {
  beforeAll,
  main: () => {
    bufferSlice(string, byteStart, byteEnd)
  },
}

export const textEncoder = {
  beforeAll,
  main: () => {
    textEncoderSlice(string, byteStart, byteEnd)
  },
}
