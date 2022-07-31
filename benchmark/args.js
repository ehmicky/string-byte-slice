// Retrieve arguments used as input for benchmarks
export const getArgs = function (character, slice, size) {
  const string = CHARACTERS[character].repeat(size)
  const { byteStart, byteEnd } = getByteIndices(slice, size)
  return { string, byteStart, byteEnd }
}

const CHARACTERS = { ascii: 'a', unicode: '\u{10000}' }

const getByteIndices = function (slice, size) {
  if (size <= 1) {
    return { byteStart: 0, byteEnd: size }
  }

  const chunk =
    slice === 'small' ? 1 : Math.round(size / SLICE_RATIOS[slice]) - 1
  return { byteStart: chunk, byteEnd: size - chunk }
}

const SLICE_RATIOS = { large: 2, medium: 5 }
