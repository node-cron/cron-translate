const { assert } = require('chai');
const toCron = require('../src/to-cron');

describe('toCron', () => {
    describe('month', () => {
        it('should parse every month', () => {
            let result = toCron('every month');
            assert.equal('0 0 0 1 * *', result); 
        });

        it('should parse every 2 months', () => {
            let result = toCron('every 2 months');
            assert.equal('0 0 0 1 */2 *', result); 
        });
    
        it('should translate on month 4', () => {
            let result = toCron('on month 4');
            assert.equal('0 0 0 1 4 *', result); 
        });
    
        it('should translate every month 4', () => {
            let result = toCron('every month 4');
            assert.equal('0 0 0 1 4 *', result); 
        });
    
        it('should translate on month 4,5,6', () => {
            let result = toCron('on month 4,5,6');
            assert.equal('0 0 0 1 4,5,6 *', result); 
        });
    
        it('should translate every month 4,5,6', () => {
            let result = toCron('every month 4,5,6');
            assert.equal('0 0 0 1 4,5,6 *', result); 
        });

        it('should translate every month on day 2', () => {
            let result = toCron('every month on day 2');
            assert.equal('0 0 0 2 * *', result); 
        });

        it('should translate every month 5 on day 2', () => {
            let result = toCron('every month 5 on day 2');
            assert.equal('0 0 0 2 5 *', result); 
        });

        it('should translate every month 5 every 2 days', () => {
            let result = toCron('every month 5 every 2 days');
            assert.equal('0 0 0 */2 5 *', result); 
        });

        it('should translate on month 5 every 2 days', () => {
            let result = toCron('on month 5 every 2 days');
            assert.equal('0 0 0 */2 5 *', result); 
        });

        it('should translate every month 5 every 2 hour on day 3 on minute 2 on second 30', () => {
            let result = toCron('every month 5 on day 3 every 2 hours on minute 2 on second 30');
            assert.equal('30 2 */2 3 5 *', result); 
        });

        it('should translate using month name', () => {
            let result = toCron('every month jan,feb');
            assert.equal('0 0 0 1 jan,feb *', result); 
        });

        it('should translate every jan', () => {
            let result = toCron('every jan');
            assert.equal('0 0 0 1 jan *', result); 
        });

        it('should translate every january', () => {
            let result = toCron('every january');
            assert.equal('0 0 0 1 january *', result);
        });

        it('should translate every feb', () => {
            let result = toCron('every feb');
            assert.equal('0 0 0 1 feb *', result); 
        });

        it('should translate every february', () => {
            let result = toCron('every february');
            assert.equal('0 0 0 1 february *', result); 
        });

        it('should translate every mar', () => {
            let result = toCron('every mar');
            assert.equal('0 0 0 1 mar *', result); 
        });

        it('should translate every march', () => {
            let result = toCron('every march');
            assert.equal('0 0 0 1 march *', result); 
        });

        it('should translate every apr', () => {
            let result = toCron('every apr');
            assert.equal('0 0 0 1 apr *', result); 
        });

        it('should translate every april', () => {
            let result = toCron('every april');
            assert.equal('0 0 0 1 april *', result); 
        });

        it('should translate every may', () => {
            let result = toCron('every may');
            assert.equal('0 0 0 1 may *', result); 
        });

        it('should translate every jun', () => {
            let result = toCron('every jun');
            assert.equal('0 0 0 1 jun *', result); 
        });

        it('should translate every june', () => {
            let result = toCron('every june');
            assert.equal('0 0 0 1 june *', result); 
        });

        it('should translate every jul', () => {
            let result = toCron('every jul');
            assert.equal('0 0 0 1 jul *', result); 
        });

        it('should translate every july', () => {
            let result = toCron('every july');
            assert.equal('0 0 0 1 july *', result); 
        });

        it('should translate every aug', () => {
            let result = toCron('every aug');
            assert.equal('0 0 0 1 aug *', result); 
        });

        it('should translate every august', () => {
            let result = toCron('every august');
            assert.equal('0 0 0 1 august *', result); 
        });

        it('should translate every sep', () => {
            let result = toCron('every sep');
            assert.equal('0 0 0 1 sep *', result); 
        });

        it('should translate every september', () => {
            let result = toCron('every september');
            assert.equal('0 0 0 1 september *', result); 
        });

        it('should translate every oct', () => {
            let result = toCron('every oct');
            assert.equal('0 0 0 1 oct *', result); 
        });

        it('should translate every october', () => {
            let result = toCron('every october');
            assert.equal('0 0 0 1 october *', result); 
        });

        it('should translate every nov', () => {
            let result = toCron('every nov');
            assert.equal('0 0 0 1 nov *', result); 
        });

        it('should translate every november', () => {
            let result = toCron('every november');
            assert.equal('0 0 0 1 november *', result); 
        });

        it('should translate every dec', () => {
            let result = toCron('every dec');
            assert.equal('0 0 0 1 dec *', result); 
        });

        it('should translate every december', () => {
            let result = toCron('every december');
            assert.equal('0 0 0 1 december *', result); 
        });

        it('should translate on december', () => {
            let result = toCron('on december');
            assert.equal('0 0 0 1 december *', result); 
        });

        it('should translate every jan,dec', () => {
            let result = toCron('every jan,dec');
            assert.equal('0 0 0 1 jan,dec *', result); 
        });

        it('should translate every january,december', () => {
            let result = toCron('every january,december');
            assert.equal('0 0 0 1 january,december *', result); 
        });

        it('should translate from month 1 to 10', () => {
            let result = toCron('from month 1 to 10');
            assert.equal('0 0 0 1 1-10 *', result); 
        });

        it('should translate from month 1 to 10', () => {
            let result = toCron('from jan to mar');
            assert.equal('0 0 0 1 jan-mar *', result); 
        });

        it('should translate from month 2 to 6 from hour 2 to 4 every second 42', () => {
            let result = toCron('from month 2 to 6 from hour 2 to 4 every second 42,43,44 on sunday');
            assert.equal('42,43,44 0 2-4 1 2-6 sunday', result); 
        });

        it('should translate blah', () => {
            let result = toCron('every second on minute 3 from hour 1 to 5 every 2 days on month 2 every monday');
            assert.equal('* 3 1-5 */2 2 monday', result); 
        });
    });
});