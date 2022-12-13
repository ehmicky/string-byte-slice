// Retrieve arguments used as input for benchmarks
export const getArgs = ({
  stringLength,
  charWidth,
  complexity,
  startOnly,
  slice,
}) => {
  const string = getString({ stringLength, charWidth, complexity, startOnly })
  const { byteStart, byteEnd } = getByteIndices(slice, stringLength)
  return { string, byteStart, byteEnd }
}

// Retrieve string used as input for benchmarks
const getString = ({
  stringLength = 10,
  charWidth = 3,
  complexity = 4,
  startOnly = false,
}) => {
  const complexChar = CHARACTERS[charWidth]

  if (stringLength === 1) {
    return complexChar
  }

  const [, simpleChar] = CHARACTERS

  if (startOnly) {
    return `${complexChar}${simpleChar.repeat(stringLength - 1)}`
  }

  const complexChars = complexChar.repeat(complexity)
  const simpleChars = simpleChar.repeat(MAX_COMPLEXITY - complexity)
  const chunk = `${complexChars}${simpleChars}`
  return chunk.repeat(stringLength / MAX_COMPLEXITY)
}

// Unicode characters from 0 to 4 UTF-8 bytes
const CHARACTERS = ['', 'a', '\u00B1', '\u25CA', '\u{1F525}']
// Maximum value for `complexity`
const MAX_COMPLEXITY = 10

const getByteIndices = (slice, stringLength) => {
  if (stringLength <= 1) {
    return { byteStart: 0, byteEnd: stringLength }
  }

  const chunk =
    slice === 'large' ? 1 : Math.round(stringLength / SLICE_RATIOS[slice]) - 1
  return { byteStart: chunk, byteEnd: stringLength - chunk }
}

const SLICE_RATIOS = { small: 2, medium: 5 }
