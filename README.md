[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/string-byte-slice.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/string-byte-slice)
[![Node](https://img.shields.io/node/v/string-byte-slice.svg?logo=node.js)](https://www.npmjs.com/package/string-byte-slice)
[![TypeScript](https://img.shields.io/badge/-typed-brightgreen?logo=typescript&colorA=gray)](/src/main.d.ts)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-brightgreen.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-brightgreen.svg?logo=medium)](https://medium.com/@ehmicky)

Like `string.slice()` but bytewise.

[`string.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice)
operates character-wise. Each character can take up to 4 bytes when serialized
with UTF-8 (in a file, network request, etc.). This library does the same, but
bytewise. This enables slicing or truncating a string to a specific amount of
bytes.

# Features

- Same [interface](#api) as `string.slice()`
- [Fastest](#benchmarks) available library in JavaScript.
- Works on all platforms (Node.js, browsers, Deno, etc.)

# Example

```js
import stringByteSlice from 'string-byte-slice'

// Works like `string.slice()`
stringByteSlice('abcd', 1) // "bcd"
stringByteSlice('abcd', 1, 3) // "bc"
stringByteSlice('abcd', -3) // "bcd"
stringByteSlice('abcd', 0, -1) // "abc"
stringByteSlice('abcd', 0, 100) // "abcd"
stringByteSlice('abcd', 0, -100) // ""

// UTF-8 bytes length is taken into account
stringByteSlice('abcdef', 4) // "ef"
stringByteSlice('\0bcdef', 4) // "ef"
stringByteSlice('±bcdef', 4) // "def"
stringByteSlice('★bcdef', 4) // "cdef
stringByteSlice('🦄bcdef', 4) // "bcdef"

// Partially cut characters are discarded
stringByteSlice('🦄bcdef', 1) // "bcdef"
```

# Install

```bash
npm install string-byte-slice
```

This package is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# API

## stringByteSlice(input, start, end?)

`input` `string`\
`start` `number`\
`end` `number?`\
_Return value_: `string`

Returns a copy of `input`:

- From byte `start`
- Up to `end` (excluded) (if specified).

`start` and `end`:

- Are integers that start at 0
- Can be negative to search from the end instead
- Can be out-of-bound, in which case they stop at the start or end of `input`

Since Unicode characters can span multiple bytes, if the first or last character
of slice has been cut in its middle, it is discarded from the return value. This
means the `start` and `end` might end up being up to 3 bytes larger than
specified.

# Benchmarks

# Related projects

- [`string-byte-length`](https://github.com/ehmicky/string-byte-length): Get the
  UTF-8 byte length of a string.
- [`truncate-json`](https://github.com/ehmicky/truncate-json): Truncate a JSON
  string.

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<!--
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/string-byte-slice/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/string-byte-slice/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
