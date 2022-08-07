// UTF-8 characters are at most 4 bytes long, so we can normalize:
//  - Very high end to `undefined`, based on `string.length`
//  - Very low negative start|end to `0`
export const normalizeByteEnd = function (string, byteEnd) {
  if (byteEnd === undefined) {
    return byteEnd
  }

  const byteEndA = normalizeByteIndex(string, byteEnd)
  return byteEndA >= string.length * MAX_UTF8_CHAR_LENGTH ? undefined : byteEndA
}

export const normalizeByteIndex = function (string, byteIndex) {
  return byteIndex <= string.length * -MAX_UTF8_CHAR_LENGTH ? 0 : byteIndex
}

const MAX_UTF8_CHAR_LENGTH = 4
