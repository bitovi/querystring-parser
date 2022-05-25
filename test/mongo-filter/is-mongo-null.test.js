const isMongoNull = require('../../lib/mongo-filter/is-mongo-null')

describe('isMongoDate', () => {
    test('should check if a value from a mongodb-style querystring represents "null"', () => {
        // mongo null
        expect(isMongoNull('null')).toBe(true)

        // not mongo null
        expect(isMongoNull()).toBe(false)
        expect(isMongoNull(null)).toBe(false)
        expect(isMongoNull('')).toBe(false)
        expect(isMongoNull(true)).toBe(false)
        expect(isMongoNull(false)).toBe(false)
        expect(isMongoNull(1)).toBe(false)
        expect(isMongoNull(0)).toBe(false)
        expect(isMongoNull(NaN)).toBe(false)
    })
})