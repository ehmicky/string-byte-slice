// Validate arguments
export const validateInput = function (input, byteStart, byteEnd) {
  if (typeof input !== 'string') {
    throw new TypeError(`First argument must be a string: ${input}`)
  }

  validateByteStart(byteStart)
  validateByteEnd(byteEnd)
}

const validateByteStart = function (byteStart) {
  if (byteStart === undefined) {
    throw new TypeError('Second argument is required.')
  }

  validateIndex('Second', byteStart)
}

const validateByteEnd = function (byteEnd) {
  if (byteEnd !== undefined) {
    validateIndex('Third', byteEnd)
  }
}

const validateIndex = function (name, byteIndex) {
  if (!Number.isInteger(byteIndex)) {
    throw new TypeError(`${name} argument must be an integer: ${byteIndex}`)
  }
}
