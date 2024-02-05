const sum = require('../src/sum');

describe('Sum', () => {
    it('should return a sum of two numbers', () => {
        const o = sum(1,2);
        expect(o).toBe(3)
    })
})