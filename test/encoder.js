// Test using `TextEncoder`, if supported
// eslint-disable-next-line fp/no-mutation, import/unambiguous
globalThis.TEST_TEXT_ENCODER = true

await import('./helpers/main.js')
