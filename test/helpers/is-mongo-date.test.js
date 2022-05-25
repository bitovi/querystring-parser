const isMongoDate = require('../../lib/helpers/is-mongo-date')

describe('isMongoDate', () => {
    test('should check if a value from a mongodb-style querystring is a date', () => {
        // date (correct format)
        expect(isMongoDate('2020-01-01')).toBe(true)

        // not a date (or incorrect format)
        expect(isMongoDate('2020/01/01')).toBe(false)
        expect(isMongoDate('20200101')).toBe(false)
        expect(isMongoDate(20200101)).toBe(false)

        expect(isMongoDate()).toBe(false)
        expect(isMongoDate(null)).toBe(false)
        expect(isMongoDate('')).toBe(false)
        expect(isMongoDate(1)).toBe(false)
        expect(isMongoDate('1')).toBe(false)
    })
})