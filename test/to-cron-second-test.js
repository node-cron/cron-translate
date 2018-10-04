const { assert } = require('chai');
const toCron = require('../src/to-cron');

describe('toCron', () => {
    describe('second', () => {
        it('should parse every second', () => {
            let result = toCron('every second');
            assert.equal('* * * * * *', result); 
        });

        it('should parse every 2 seconds', () => {
            let result = toCron('every 2 seconds');
            assert.equal('*/2 * * * * *', result); 
        });
    
        it('should translate on second 4', () => {
            let result = toCron('on second 4');
            assert.equal('4 * * * * *', result); 
        });
    
        it('should translate every second 4', () => {
            let result = toCron('every second 4');
            assert.equal('4 * * * * *', result); 
        });
    
        it('should translate on second 4,5,6', () => {
            let result = toCron('on second 4,5,6');
            assert.equal('4,5,6 * * * * *', result); 
        });
    
        it('should translate every second 4,5,6', () => {
            let result = toCron('every second 4,5,6');
            assert.equal('4,5,6 * * * * *', result); 
        });

        it('should translate from 1 to 30', () => {
            let result = toCron('from second 1 to 30');
            assert.equal('1-30 * * * * *', result); 
        });
    });
});