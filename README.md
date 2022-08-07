[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/string-byte-slice.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/string-byte-slice)
[![Node](https://img.shields.io/node/v/string-byte-slice.svg?logo=node.js)](https://www.npmjs.com/package/string-byte-slice)
[![TypeScript](https://img.shields.io/badge/-typed-brightgreen?logo=typescript&colorA=gray)](/src/main.d.ts)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-brightgreen.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-brightgreen.svg?logo=medium)](https://medium.com/@ehmicky)

Like `string.slice()` but bytewise.

[`string.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice)
operates character-wise. Each character can take up to 4 bytes when serialized
with UTF-8 (in a file, network request, etc.). This library slices or truncates
a string to a specific amount of bytes instead.

# Features

- Same [interface](#api) as `string.slice()`
- [Fastest](#benchmarks) available library in JavaScript
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
stringByteSlice('abcdef', 0, 4) // "abcd"
stringByteSlice('\nbcdef', 0, 4) // "\nbcd"
stringByteSlice('±bcdef', 0, 4) // "±bc"
stringByteSlice('★bcdef', 0, 4) // "★b"
stringByteSlice('🦄bcdef', 0, 4) // "🦄"

// Partially cut characters are discarded
stringByteSlice('🦄bcdef', 0, 3) // ""
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
- If specified: up to byte `end` (excluded)

`start` and `end`:

- Are integers that start at 0
- Can be negative to search from the end instead
- If out-of-bound, stop at the start or end of `input`

Since Unicode characters can span multiple bytes, if the first or last character
of the slice has been cut in its middle, it is discarded from the return value.
This means the `start` and `end` might end up being up to 3 bytes larger than
specified.

# Benchmarks

There are several ways to slice a string bytewise:

- Iterating through each codepoint using
  [`string.charCodeAt()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)
  or
  [`string.codePointAt()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt)
- Using Node.js `Buffer`, e.g.
  [`Buffer.from()`](https://nodejs.org/api/buffer.html#static-method-bufferfromstring-encoding)
  and
  [`buffer.subarray()`](https://nodejs.org/api/buffer.html#bufsubarraystart-end)
- Using
  [`TextEncoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
  and
  [`TextDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)

Which one is the fastest depends on:

- The string length
- How often the characters are ASCII or not
- Whether the method is supported in the current platform

This library picks the fastest method based on the platform and the `input`.

```
                                                                              String length
                                                           1      1e1    1e2     1e3     1e4     1e5     1e6     1e7     1e8

Small slice  Only ASCII         String.charCodeAt()   19.2ns   36.2ns  219ns  2.02μs 20.21μs 196.0μs  2.70ms 27.34ms 269.0ms
                                Buffer.from()        294.1ns  322.2ns  384ns  0.59μs  3.34μs  24.7μs  0.26ms  3.13ms  51.9ms
                                TextEncoder          979.0ns 1010.0ns 1110ns  1.00μs  1.63μs  16.5μs  0.21ms  2.63ms  34.1ms

             Mostly ASCII       String.charCodeAt()   22.3ns   31.2ns  255ns  2.54μs  31.2μs 308.7μs  3.24ms  34.4ms   343ms
             Very few non-ASCII Buffer.from()        197.6ns  327.4ns  436ns  1.38μs  17.8μs 159.0μs  1.52ms  15.4ms   165ms
                                TextEncoder          799.0ns 1050.0ns 1090ns  1.70μs   7.9μs  59.7μs  0.60ms   6.2ms    68ms

             Mostly ASCII       String.charCodeAt()   22.3ns   41.7ns  271ns  2.09μs  22.2μs   223μs  2.37ms  28.6ms   281ms
             Some non-ASCII     Buffer.from()        197.6ns  409.2ns  587ns  2.27μs  25.5μs   236μs  2.34ms  23.1ms   238ms
                                TextEncoder          799.0ns 1060.0ns 1170ns  2.01μs  11.3μs    92μs  0.96ms   9.7ms   104ms

             Only non-ASCII     String.charCodeAt()   22.3ns   28.0ns  163ns  1.15μs  15.6μs   109μs  1.47ms  14.5ms   145ms
                                Buffer.from()        197.6ns  283.8ns  877ns  5.74μs  75.3μs   675μs  7.49ms  74.8ms   725ms
                                TextEncoder          799.0ns  803.0ns 1160ns  4.16μs  36.5μs   373μs  3.65ms  41.0ms   401ms

Medium slice Only ASCII         String.charCodeAt()   19.2ns   32.9ns  237ns  3.32μs 20.33μs 270.3μs  2.71ms 26.64ms 268.8ms
                                Buffer.from()        294.1ns  330.9ns  380ns  0.65μs  3.94μs  34.5μs  0.49ms  6.05ms  73.0ms
                                TextEncoder          979.0ns 1040.0ns 1130ns  2.40μs  7.48μs  74.8μs  0.91ms  8.62ms 141.8ms

             Mostly ASCII       String.charCodeAt()   22.3ns   44.6ns  271ns  4.11μs  27.2μs   281μs  3.40ms  34.4ms   341ms
             Very few non-ASCII Buffer.from()        197.6ns  424.4ns  517ns  1.70μs  17.2μs   157μs  1.78ms  19.0ms   187ms
                                TextEncoder          799.0ns 1040.0ns 1270ns  3.03μs  11.9μs   113μs  1.29ms  12.3ms   175ms

             Mostly ASCII       String.charCodeAt()   22.3ns   53.1ns  285ns  3.71μs  22.7μs   226μs  2.81ms  28.3ms   281ms
             Some non-ASCII     Buffer.from()        197.6ns  420.0ns  742ns  3.49μs  37.6μs   359μs  3.93ms  39.0ms   376ms
                                TextEncoder          799.0ns 1110.0ns 1290ns  5.12μs  17.6μs   173μs  1.94ms  17.7ms   225ms

             Only non-ASCII     String.charCodeAt()   22.3ns   42.5ns  138ns  1.17μs  10.9μs   108μs  1.47ms  14.6ms   145ms
                                Buffer.from()        197.6ns  461.0ns 1214ns  8.82μs  91.3μs   901μs  9.33ms  99.4ms   955ms
                                TextEncoder          799.0ns 1150.0ns 1580ns  8.01μs  51.8μs   622μs  5.01ms  53.9ms   553ms

Large slice  Only ASCII         String.charCodeAt()   19.2ns   40.0ns  241ns  1.89μs 26.18μs 206.2μs  2.69ms 27.08ms 267.9ms
                                Buffer.from()        294.1ns  334.8ns  397ns  0.66μs  4.01μs  33.8μs  0.56ms  7.24ms  84.6ms
                                TextEncoder          979.0ns 1010.0ns 1820ns  2.79μs 10.50μs 108.0μs  1.43ms 16.10ms 210.0ms

             Mostly ASCII       String.charCodeAt()   22.3ns    50.ns  299ns  4.09μs  27.6μs   348μs  3.41ms  34.1ms   341ms
             Very few non-ASCII Buffer.from()        197.6ns  425.0ns  580ns  1.76μs  17.0μs   158μs  1.89ms  19.9ms   197ms
                                TextEncoder          799.0ns 1080.0ns 1620ns  3.40μs  14.9μs   153μs  1.79ms  19.9ms   244ms

             Mostly ASCII       String.charCodeAt()   22.3ns   44.6ns  256ns  2.34μs  23.1μs   233μs  2.61ms  25.7ms   257ms
             Some non-ASCII     Buffer.from()        197.6ns  416.9ns  852ns  4.42μs  48.1μs   490μs  4.40ms  43.9ms   435ms
                                TextEncoder          799.0ns 1080.0ns 1670ns  3.96μs  21.5μs   256μs  2.60ms  26.2ms   305ms

             Only non-ASCII     String.charCodeAt()   22.3ns   41.8ns  135ns  1.13μs  15.1μs   147μs  1.46ms  14.6ms   146ms
                                Buffer.from()        197.6ns  477.1ns 1379ns 10.08μs 118.6μs  1067μs 10.93ms 112.6ms  1113ms
                                TextEncoder          799.0ns 1160.0ns 1990ns  7.28μs  62.0μs   545μs  5.75ms  63.2ms   637ms
```

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
