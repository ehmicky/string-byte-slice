import { expectType, expectNotType, expectError } from 'tsd'

import stringByteSlice from 'string-byte-slice'

expectType<string>(stringByteSlice('a', 0))
expectError(stringByteSlice(true))
expectError(stringByteSlice('a'))
expectError(stringByteSlice('a', '0'))

expectType<''>(stringByteSlice('', 0))
expectNotType<''>(stringByteSlice('a', 0))

stringByteSlice('a', 0, -1)
expectError(stringByteSlice('a', '0', '0'))
