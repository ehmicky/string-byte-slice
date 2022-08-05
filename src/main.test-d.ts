import { expectType, expectAssignable } from 'tsd'

import stringByteSlice, { Options } from './main.js'

expectType<object>(stringByteSlice(true))

stringByteSlice(true, {})
expectAssignable<Options>({})
