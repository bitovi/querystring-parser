const isNumberString = require('../../lib/helpers/is-number-string')

describe('isNumberString', () => {
    test('should check if a value from a querystring is a number', () => {
        // numbers string
        expect(isNumberString('0')).toBe(true)
        expect(isNumberString('1')).toBe(true)
        expect(isNumberString('-1')).toBe(true)
        expect(isNumberString('.5')).toBe(true)
        expect(isNumberString('-.5')).toBe(true)
        expect(isNumberString('0.5')).toBe(true)
        expect(isNumberString('-0.5')).toBe(true)
        expect(isNumberString('1.5')).toBe(true)
        expect(isNumberString('-1.5')).toBe(true)

        // not number string
        expect(isNumberString('')).toBe(false)
        expect(isNumberString(' ')).toBe(false)
        expect(isNumberString('michael')).toBe(false)
        expect(isNumberString('null')).toBe(false)
        expect(isNumberString('undefined')).toBe(false)
        expect(isNumberString('true')).toBe(false)
        expect(isNumberString('false')).toBe(false)
        expect(isNumberString('{}')).toBe(false)
        expect(isNumberString('[]')).toBe(false)

        expect(isNumberString()).toBe(false)
        expect(isNumberString(null)).toBe(false)
    })
})