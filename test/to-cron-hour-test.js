const { assert } = require('chai');
const toCron = require('../src/to-cron');

describe('toCron', () => {
    describe('hour', () => {
        it('should parse every hour', () => {
            let result = toCron('every hour');
            assert.equal('0 0 * * * *', result); 
        });

        it('should parse every 2 hours', () => {
            let result = toCron('every 2 hours');
            assert.equal('0 0 */2 * * *', result); 
        });
    
        it('should translate on hour 4', () => {
            let result = toCron('on hour 4');
            assert.equal('0 0 4 * * *', result); 
        });
    
        it('should translate every hour 4', () => {
            let result = toCron('every hour 4');
            assert.equal('0 0 4 * * *', result); 
        });
    
        it('should translate on hour 4,5,6', () => {
            let result = toCron('on hour 4,5,6');
            assert.equal('0 0 4,5,6 * * *', result); 
        });
    
        it('should translate every hour 4,5,6', () => {
            let result = toCron('every hour 4,5,6');
            assert.equal('0 0 4,5,6 * * *', result); 
        });

        it('should translate every hour on minute 2', () => {
            let result = toCron('every hour on minute 2');
            assert.equal('0 2 * * * *', result); 
        });

        it('should translate every hour 5 on minute 2', () => {
            let result = toCron('every hour 5 on minute 2');
            assert.equal('0 2 5 * * *', result); 
        });

        it('should translate every hour 5 every 2 minutes', () => {
            let result = toCron('every hour 5 every 2 minutes');
            assert.equal('0 */2 5 * * *', result); 
        });

        it('should translate on hour 5 every 2 minutes', () => {
            let result = toCron('on hour 5 every 2 minutes');
            assert.equal('0 */2 5 * * *', result); 
        });

        it('should translate on hour 5 every 2 minutes on second 3', () => {
            let result = toCron('on hour 5 every 2 minutes on second 3');
            assert.equal('3 */2 5 * * *', result); 
        });

        it('should translate on hour 5 every 2 minutes every second', () => {
            let result = toCron('on hour 5 every 2 minutes every second');
            assert.equal('* */2 5 * * *', result); 
        });

        it('should translate from hour 1 to 30', () => {
            let result = toCron('from hour 1 to 30');
            assert.equal('0 0 1-30 * * *', result); 
        });
    });

});