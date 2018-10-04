const { assert } = require('chai');
const toCron = require('../src/to-cron');

describe('toCron', () => {
    describe('minute', () => {
        it('should parse every minute', () => {
            let result = toCron('every minute');
            assert.equal('0 * * * * *', result); 
        });

        it('should parse every 2 minutes', () => {
            let result = toCron('every 2 minutes');
            assert.equal('0 */2 * * * *', result); 
        });
    
        it('should translate on minute 4', () => {
            let result = toCron('on minute 4');
            assert.equal('0 4 * * * *', result); 
        });
    
        it('should translate every minute 4', () => {
            let result = toCron('every minute 4');
            assert.equal('0 4 * * * *', result); 
        });
    
        it('should translate on minute 4,5,6', () => {
            let result = toCron('on minute 4,5,6');
            assert.equal('0 4,5,6 * * * *', result); 
        });
    
        it('should translate every minute 4,5,6', () => {
            let result = toCron('every minute 4,5,6');
            assert.equal('0 4,5,6 * * * *', result); 
        });

        it('should translate every minute on second 2', () => {
            let result = toCron('every minute on second 2');
            assert.equal('2 * * * * *', result); 
        });

        it('should translate every minute 5 on second 2', () => {
            let result = toCron('every minute 5 on second 2');
            assert.equal('2 5 * * * *', result); 
        });

        it('should translate every minute 5 every 2 seconds', () => {
            let result = toCron('every minute 5 every 2 seconds');
            assert.equal('*/2 5 * * * *', result); 
        });

        it('should translate on minute 5 every 2 seconds', () => {
            let result = toCron('on minute 5 every 2 seconds');
            assert.equal('*/2 5 * * * *', result); 
        });

        it('should translate from minute 1 to 30', () => {
            let result = toCron('from minute 1 to 30');
            assert.equal('0 1-30 * * * *', result); 
        });
    });

});