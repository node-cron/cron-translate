const { assert } = require('chai');
const toCron = require('../src/to-cron');

describe('toCron', () => {
    describe('month', () => {
        it('should parse every week', () => {
            let result = toCron('every week');
            assert.equal('0 0 0 * * 0', result); 
        });

        it('should parse every sunday', () => {
            let result = toCron('every sunday');
            assert.equal('0 0 0 * * sunday', result); 
        });

        it('should parse every sun', () => {
            let result = toCron('every sun');
            assert.equal('0 0 0 * * sun', result); 
        });

        it('should parse every monday', () => {
            let result = toCron('every monday');
            assert.equal('0 0 0 * * monday', result); 
        });

        it('should parse every mon', () => {
            let result = toCron('every mon');
            assert.equal('0 0 0 * * mon', result); 
        });

        it('should parse every tuesday', () => {
            let result = toCron('every tuesday');
            assert.equal('0 0 0 * * tuesday', result); 
        });

        it('should parse every tue', () => {
            let result = toCron('every tue');
            assert.equal('0 0 0 * * tue', result); 
        });

        it('should parse every wednesday', () => {
            let result = toCron('every wednesday');
            assert.equal('0 0 0 * * wednesday', result); 
        });

        it('should parse every wed', () => {
            let result = toCron('every wed');
            assert.equal('0 0 0 * * wed', result); 
        });

        it('should parse every thursday', () => {
            let result = toCron('every thursday');
            assert.equal('0 0 0 * * thursday', result); 
        });

        it('should parse every thu', () => {
            let result = toCron('every thu');
            assert.equal('0 0 0 * * thu', result); 
        });

        it('should parse every friday', () => {
            let result = toCron('every friday');
            assert.equal('0 0 0 * * friday', result); 
        });

        it('should parse every fri', () => {
            let result = toCron('every fri');
            assert.equal('0 0 0 * * fri', result); 
        });

        it('should parse every saturday', () => {
            let result = toCron('every saturday');
            assert.equal('0 0 0 * * saturday', result); 
        });

        it('should parse every sat', () => {
            let result = toCron('every sat');
            assert.equal('0 0 0 * * sat', result); 
        });

        it('should parse every sat on hour 3', () => {
            let result = toCron('every sat on hour 3');
            assert.equal('0 0 3 * * sat', result); 
        });

        it('should parse every friday on day 13 on hour 0', () => {
            let result = toCron('every friday on day 13 on hour 0');
            assert.equal('0 0 0 13 * friday', result); 
        });

        it('should translate every every friday hour 3', () => {
            let result = toCron('every friday on hour 3');
            assert.equal('0 0 3 * * friday', result); 
        });

        it('should translate every hour 3 every friday', () => {
            let result = toCron('every hour 3 every friday');
            assert.equal('0 0 3 * * friday', result); 
        });

        it('should translate every mon,sat', () => {
            let result = toCron('every mon,sat');
            assert.equal('0 0 0 * * mon,sat', result); 
        });

        it('should translate every monday,saturday', () => {
            let result = toCron('every monday,saturday');
            assert.equal('0 0 0 * * monday,saturday', result); 
        });

        it('should translate from week day 1 to 4', () => {
            let result = toCron('from week day 1 to 4');
            assert.equal('0 0 0 * * 1-4', result); 
        });

        it('should translate from week day 1 to 4', () => {
            let result = toCron('from mon to wed');
            assert.equal('0 0 0 * * mon-wed', result); 
        });
    });
});