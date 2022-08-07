/**
 *
 * @example
 * ```js
 * ```
 */
export default function stringByteSlice<T extends string>(
  input: T,
  byteStart: number,
  byteEnd?: number,
): T extends '' ? '' : string
