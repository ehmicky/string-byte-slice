// Test using `TextEncoder`, if supported
// eslint-disable-next-line fp/no-mutation, import/unambiguous
globalThis.TEST_STRING_BYTE_SLICE = 'encoder'

await import('./helpers/main.js')
