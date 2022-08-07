// Retrieve arguments used as input for benchmarks
export const getArgs = function (character, slice, size) {
  const string = getString(character, size)
  const { byteStart, byteEnd } = getByteIndices(slice, size)
  return { string, byteStart, byteEnd }
}

// Retrieve string used as input for benchmarks
const getString = function (character, size) {
  if (character === 'complex') {
    return COMPLEX_CHARACTER.repeat(size)
  }

  if (character.startsWith('normal')) {
    return getNormalString(character, size)
  }

  const firstChar = character === 'simple' ? '' : COMPLEX_CHARACTER
  return `${firstChar}${SIMPLE_CHARACTER.repeat(size)}`
}

const getNormalString = function (character, size) {
  if (size === 1) {
    return SIMPLE_CHARACTER
  }

  const percentage = getPercentage(character)
  const simpleCharacters = SIMPLE_CHARACTER.repeat(CHUNK_SIZE - percentage)
  const complexCharacters = COMPLEX_CHARACTER.repeat(percentage)
  const chunk = `${complexCharacters}${simpleCharacters}`
  const chunksCount = size / CHUNK_SIZE
  return chunk.repeat(chunksCount)
}

const getPercentage = function (character) {
  const [, percentage = '10'] = character.split('-')
  return Number(percentage)
}

const SIMPLE_CHARACTER = 'a'
const COMPLEX_CHARACTER = '\u{10000}'
const CHUNK_SIZE = 100

const getByteIndices = function (slice, size) {
  if (size <= 1) {
    return { byteStart: 0, byteEnd: size }
  }

  const chunk =
    slice === 'large' ? 1 : Math.round(size / SLICE_RATIOS[slice]) - 1
  return { byteStart: chunk, byteEnd: size - chunk }
}

const SLICE_RATIOS = { small: 2, medium: 5 }
