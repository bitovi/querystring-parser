const isMongoNumber = require('../../lib/helpers/is-mongo-number')

describe('isMongoNumber', () => {
    test('should check if a value from a mongodb-style querystring is a number', () => {
        // numbers
        expect(isMongoNumber('0')).toBe(true)
        expect(isMongoNumber('1')).toBe(true)
        expect(isMongoNumber('-1')).toBe(true)
        expect(isMongoNumber('.5')).toBe(true)
        expect(isMongoNumber('-.5')).toBe(true)
        expect(isMongoNumber('0.5')).toBe(true)
        expect(isMongoNumber('-0.5')).toBe(true)
        expect(isMongoNumber('1.5')).toBe(true)
        expect(isMongoNumber('-1.5')).toBe(true)

        // not numbers
        expect(isMongoNumber('')).toBe(false)
        expect(isMongoNumber(' ')).toBe(false)
        expect(isMongoNumber('michael')).toBe(false)
        expect(isMongoNumber('null')).toBe(false)
        expect(isMongoNumber('undefined')).toBe(false)
        expect(isMongoNumber('true')).toBe(false)
        expect(isMongoNumber('false')).toBe(false)
        expect(isMongoNumber('{}')).toBe(false)
        expect(isMongoNumber('[]')).toBe(false)

        expect(isMongoNumber()).toBe(false)
        expect(isMongoNumber(null)).toBe(false)
    })
})