[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/string-byte-slice.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/string-byte-slice)
[![TypeScript](https://img.shields.io/badge/-typed-brightgreen?logo=typescript&colorA=gray&logoColor=0096ff)](/types/main.d.ts)
[![Node](https://img.shields.io/node/v/string-byte-slice.svg?logo=node.js&logoColor=66cc33)](https://www.npmjs.com/package/string-byte-slice)
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
This means the `start` and `end` might end up being up to 3 bytes off from the
specified value.

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
  [`TextEncoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder),
  [`TextDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)
  and
  [`uint8array.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray)
  or
  [`uint8array.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice)

Which one is the fastest depends on many factors including:

- The string length
- How often the characters are ASCII or not
- How big the slice is
- Whether the method is supported in the current platform

This library picks the fastest method based on the platform and the `input`.

```
                                                                              String length
                                                           1      1e1    1e2     1e3     1e4     1e5     1e6     1e7     1e8

Small slice  Only ASCII         string-byte-slice     38.6ns   74.5ns  355ns  1.16μs  4.11μs  26.7μs  0.26ms  3.27ms  52.6ms
                                String.charCodeAt()   23.5ns   63.0ns  361ns  3.04μs 28.29μs 288.2μs  3.16ms 31.16ms 316.0ms
                                Buffer.from()        302.6ns  359.1ns  400ns  0.62μs  3.53μs  26.5μs  0.26ms  3.22ms  53.3ms
                                TextEncoder          975.4ns  975.9ns  989ns  1.04μs  1.49μs  17.6μs  0.20ms  2.65ms  33.7ms

             Mostly ASCII       string-byte-slice     38.8ns   68.0ns  392ns  2.33μs  9.96μs  97.8μs  0.95ms  9.97ms   103ms
             Very few non-ASCII String.charCodeAt()   28.8ns   54.5ns  360ns  4.14μs 35.73μs 339.7μs  3.50ms 36.34ms   359ms
                                Buffer.from()        222.3ns  343.9ns  509ns  1.83μs 21.34μs 195.6μs  1.70ms 18.99ms   191ms
                                TextEncoder          809.5ns 1043.2ns 1105ns  1.95μs 11.49μs  95.8μs  0.95ms 10.53ms   103ms

             Mostly ASCII       string-byte-slice     38.8ns   48.1ns  235ns  3.48μs  16.6μs   206μs  2.02ms  20.7ms   214ms
             Some non-ASCII     String.charCodeAt()   28.8ns   35.9ns  233ns  2.11μs  22.3μs   241μs  2.01ms  26.5ms   212ms
                                Buffer.from()        222.3ns  252.8ns  624ns  3.30μs  34.6μs   342μs  3.36ms  34.7ms   368ms
                                TextEncoder          809.5ns  789.6ns 1156ns  2.95μs  20.1μs   205μs  2.02ms  20.8ms   224ms

             Only non-ASCII     string-byte-slice     38.6ns   55.1ns  202ns  1.93μs  16.6μs   154μs  1.38ms  16.7ms   167ms
                                String.charCodeAt()   23.5ns   50.6ns  185ns  1.42μs  17.2μs   166μs  1.68ms  16.7ms   168ms
                                Buffer.from()        302.6ns  344.2ns 1113ns  8.73μs 129.9μs  1173μs 11.82ms 124.6ms  1226ms
                                TextEncoder          975.4ns  850.4ns 1304ns  7.15μs  49.5μs   479μs  4.80ms  55.4ms   525ms

Medium slice Only ASCII         string-byte-slice     38.6ns   97.1ns  624ns  1.27μs  4.57μs  33.0μs  0.48ms  6.02ms  76.2ms
                                String.charCodeAt()   23.5ns   93.6ns  585ns  6.05μs 58.88μs 498.0μs  5.22ms 51.64ms 515.5ms
                                Buffer.from()        302.6ns  356.0ns  418ns  0.65μs  4.13μs  32.1μs  0.49ms  6.13ms  74.7ms
                                TextEncoder          975.4ns 1059.7ns 1124ns  2.50μs  7.28μs  70.0μs  0.92ms  8.80ms 140.6ms

             Mostly ASCII       string-byte-slice     38.8ns   86.7ns  611ns  3.76μs  15.6μs   151μs  1.68ms  16.3ms   212ms
             Very few non-ASCII String.charCodeAt()   28.8ns   86.2ns  608ns  5.32μs  56.9μs   557μs  5.59ms  56.0ms   564ms
                                Buffer.from()        222.3ns  353.2ns  505ns  1.97μs  23.6μs   180μs  1.97ms  20.6ms   215ms
                                TextEncoder          809.5ns 1069.8ns 1185ns  3.36μs  22.1μs   151μs  1.70ms  16.3ms   216ms

             Mostly ASCII       string-byte-slice     38.8ns   60.9ns  377ns  5.41μs  35.9μs   311μs  3.27ms  31.8ms   323ms
             Some non-ASCII     String.charCodeAt()   28.8ns   49.2ns  403ns  3.40μs  33.3μs   378μs  3.77ms  32.1ms   323ms
                                Buffer.from()        222.3ns  383.8ns  822ns  5.16μs  61.1μs   581μs  5.38ms  54.6ms   556ms
                                TextEncoder          809.5ns 1052.9ns 1536ns  4.82μs  37.6μs   399μs  3.26ms  32.0ms   370ms

             Only non-ASCII     string-byte-slice     38.8ns  134.0ns  399ns  3.26μs  31.3μs   294μs  2.91ms  28.5ms   287ms
                                String.charCodeAt()   28.8ns  116.0ns  387ns  2.89μs  30.6μs   291μs  2.86ms  29.3ms   287ms
                                Buffer.from()        222.3ns  465.0ns 1571ns 11.47μs 156.6μs  1525μs 14.54ms 148.0ms  1468ms
                                TextEncoder          809.5ns 1102.0ns 1844ns  7.83μs  65.6μs   608μs  6.25ms  66.8ms   682ms

Large slice  Only ASCII         string-byte-slice     38.6ns  103.0ns  748ns  1.26μs  4.91μs  37.4μs  0.60ms  7.54ms  88.1ms
                                String.charCodeAt()   23.5ns   95.4ns  729ns  7.42μs 66.97μs 674.3μs  6.49ms 65.62ms 651.0ms
                                Buffer.from()        302.6ns  352.2ns  406ns  0.71μs  4.52μs  35.4μs  0.62ms  7.79ms  87.2ms
                                TextEncoder          975.4ns  970.3ns 1491ns  3.12μs 20.00μs 107.7μs  1.44ms 16.48ms 214.5ms

             Mostly ASCII       string-byte-slice     38.8ns   92.4ns  747ns  4.02μs  19.3μs   195μs  2.21ms  23.7ms   279ms
             Very few non-ASCII String.charCodeAt()   28.8ns   93.2ns  832ns  7.89μs  71.4μs   702μs  7.04ms  69.3ms   692ms
                                Buffer.from()        222.3ns  400.5ns  529ns  2.07μs  19.6μs   184μs  2.15ms  22.0ms   225ms
                                TextEncoder          809.5ns 1054.1ns 1614ns  4.17μs  27.7μs   178μs  2.27ms  23.8ms   284ms

             Mostly ASCII       string-byte-slice     38.8ns   60.5ns  467ns  6.61μs  43.1μs   391μs  3.64ms  41.4ms   399ms
             Some non-ASCII     String.charCodeAt()   28.8ns   49.5ns  441ns  4.83μs  36.2μs   455μs  4.50ms  44.8ms   401ms
                                Buffer.from()        222.3ns  400.5ns  949ns  6.50μs  73.8μs   672μs  6.63ms  68.0ms   685ms
                                TextEncoder          809.5ns 1087.9ns 1765ns  5.32μs  46.3μs   485μs  4.18ms  41.6ms   459ms

             Only non-ASCII     string-byte-slice     38.8ns  125.0ns  466ns  3.79μs  38.5μs   373μs  3.68ms  36.7ms   366ms
                                String.charCodeAt()   28.8ns  124.0ns  457ns  3.63μs  37.7μs   370μs  3.67ms  37.2ms   365ms
                                Buffer.from()        222.3ns  458.0ns 1655ns 12.85μs 172.7μs  1662μs 16.14ms 165.7ms  1647ms
                                TextEncoder          809.5ns 1114.0ns 2142ns  8.19μs  75.0μs   697μs  7.13ms  76.1ms   775ms
```

# Related projects

- [`string-byte-length`](https://github.com/ehmicky/string-byte-length): Get the
  UTF-8 byte length of a string
- [`truncate-json`](https://github.com/ehmicky/truncate-json): Truncate a JSON
  string

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
