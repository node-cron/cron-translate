const { assert } = require('chai');
const toCron = require('../src/to-cron');

describe('toCron', () => {
    describe('day', () => {
        it('should parse every day', () => {
            let result = toCron('every day');
            assert.equal('0 0 0 * * *', result); 
        });

        it('should parse every 2 days', () => {
            let result = toCron('every 2 days');
            assert.equal('0 0 0 */2 * *', result); 
        });
    
        it('should translate on day 4', () => {
            let result = toCron('on day 4');
            assert.equal('0 0 0 4 * *', result); 
        });
    
        it('should translate every day 4', () => {
            let result = toCron('every day 4');
            assert.equal('0 0 0 4 * *', result); 
        });
    
        it('should translate on day 4,5,6', () => {
            let result = toCron('on day 4,5,6');
            assert.equal('0 0 0 4,5,6 * *', result); 
        });
    
        it('should translate every day 4,5,6', () => {
            let result = toCron('every day 4,5,6');
            assert.equal('0 0 0 4,5,6 * *', result); 
        });

        it('should translate every day on hour 2', () => {
            let result = toCron('every day on hour 2');
            assert.equal('0 0 2 * * *', result); 
        });

        it('should translate every day 5 on hour 2', () => {
            let result = toCron('every day 5 on hour 2');
            assert.equal('0 0 2 5 * *', result); 
        });

        it('should translate every day 5 every 2 hours', () => {
            let result = toCron('every day 5 every 2 hours');
            assert.equal('0 0 */2 5 * *', result); 
        });

        it('should translate on day 5 every 2 hours', () => {
            let result = toCron('on day 5 every 2 hours');
            assert.equal('0 0 */2 5 * *', result); 
        });

        it('should translate every day 5 on hour 3 on minute 2 on second 30', () => {
            let result = toCron('every day 5 on hour 3 on minute 2 on second 30');
            assert.equal('30 2 3 5 * *', result); 
        });

        it('should translate from day 1 to 10', () => {
            let result = toCron('from day 1 to 10');
            assert.equal('0 0 0 1-10 * *', result); 
        });
    });

});