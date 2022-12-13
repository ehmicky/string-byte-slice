// UTF-8 characters are at most 4 bytes long, so we can normalize:
//  - Very high end to `undefined`, based on `input.length`
//  - Very low negative start|end to `0`
export const normalizeByteEnd = (input, byteEnd) => {
  if (byteEnd === undefined) {
    return byteEnd
  }

  const byteEndA = normalizeByteIndex(input, byteEnd)
  return byteEndA >= input.length * MAX_UTF8_CHAR_LENGTH ? undefined : byteEndA
}

export const normalizeByteIndex = (input, byteIndex) =>
  byteIndex <= input.length * -MAX_UTF8_CHAR_LENGTH ? 0 : byteIndex

const MAX_UTF8_CHAR_LENGTH = 4
