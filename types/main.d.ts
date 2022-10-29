/**
 * Returns a copy of `input`:
 *
 *  - From byte `start`
 *  - If specified: up to byte `end` (excluded)
 *
 * `start` and `end`:
 *
 *  - Are integers that start at 0
 *  - Can be negative to search from the end instead
 *  - If out-of-bound, stop at the start or end of `input`
 *
 * @example
 * ```js
 * // Works like `string.slice()`
 * stringByteSlice('abcd', 1) // "bcd"
 * stringByteSlice('abcd', 1, 3) // "bc"
 * stringByteSlice('abcd', -3) // "bcd"
 * stringByteSlice('abcd', 0, -1) // "abc"
 * stringByteSlice('abcd', 0, 100) // "abcd"
 * stringByteSlice('abcd', 0, -100) // ""
 *
 * // UTF-8 bytes length is taken into account
 * stringByteSlice('abcdef', 0, 4) // "abcd"
 * stringByteSlice('\nbcdef', 0, 4) // "\nbcd"
 * stringByteSlice('±bcdef', 0, 4) // "±bc"
 * stringByteSlice('★bcdef', 0, 4) // "★b"
 * stringByteSlice('🦄bcdef', 0, 4) // "🦄"
 *
 * // Partially cut characters are discarded
 * stringByteSlice('🦄bcdef', 0, 3) // ""
 * ```
 */
export default function stringByteSlice<T extends string>(
  input: T,
  byteStart: number,
  byteEnd?: number,
): T extends '' ? '' : string
