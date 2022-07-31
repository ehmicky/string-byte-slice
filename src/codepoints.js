// Last ASCII character (1 byte)
export const LAST_ASCII_CODEPOINT = 0x7f

// Last 2-bytes character
export const LAST_TWO_BYTES_CODEPOINT = 0x7_ff

// Others are 3 bytes characters
// However, U+d800 to U+dbff:
//  - Followed by U+dc00 to U+dfff -> 4 bytes together (astral character)
//  - Otherwise -> 3 bytes (like above)
export const FIRST_LOW_SURROGATE = 0xd8_00
export const LAST_LOW_SURROGATE = 0xdb_ff
export const FIRST_HIGH_SURROGATE = 0xdc_00
export const LAST_HIGH_SURROGATE = 0xdf_ff
