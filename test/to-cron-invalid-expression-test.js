const { assert } = require('chai');
const toCron = require('../src/to-cron');

describe('toCron', () => {
    describe('invalid expression', () => {
        it('should fail with invalid value', () => {
            assert.throws(() => {
                toCron('every invalid');
            }, 'Invalid expression!')
        });

        it('should fail on invalid command', () => {
            assert.throws(() => {
                toCron('invalid expression');
            }, 'invalid expression at invalid')
        });

        it('should fail on invalid command', () => {
            assert.throws(() => {
                toCron('every day 2 invalid');
            }, 'invalid expression at invalid')
        });
    });
});