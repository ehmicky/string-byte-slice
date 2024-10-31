import { expectNotType, expectType } from 'tsd'

import stringByteSlice from 'string-byte-slice'

expectType<string>(stringByteSlice('a', 0))
// @ts-expect-error
stringByteSlice(true)
// @ts-expect-error
stringByteSlice('a')
// @ts-expect-error
stringByteSlice('a', '0')

expectType<''>(stringByteSlice('', 0))
expectNotType<''>(stringByteSlice('a', 0))

stringByteSlice('a', 0, -1)
// @ts-expect-error
stringByteSlice('a', '0', '0')
