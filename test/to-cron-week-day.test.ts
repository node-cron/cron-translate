import { describe, it, expect } from 'vitest';
import { toCron } from '../src/index';

describe('toCron', () => {
  describe('week day', () => {
    it('should parse every week', () => {
      expect(toCron('every week')).toBe('0 0 0 * * 0');
    });

    it('should parse every sunday', () => {
      expect(toCron('every sunday')).toBe('0 0 0 * * sunday');
    });

    it('should parse every sun', () => {
      expect(toCron('every sun')).toBe('0 0 0 * * sun');
    });

    it('should parse every monday', () => {
      expect(toCron('every monday')).toBe('0 0 0 * * monday');
    });

    it('should parse every mon', () => {
      expect(toCron('every mon')).toBe('0 0 0 * * mon');
    });

    it('should parse every tuesday', () => {
      expect(toCron('every tuesday')).toBe('0 0 0 * * tuesday');
    });

    it('should parse every tue', () => {
      expect(toCron('every tue')).toBe('0 0 0 * * tue');
    });

    it('should parse every wednesday', () => {
      expect(toCron('every wednesday')).toBe('0 0 0 * * wednesday');
    });

    it('should parse every wed', () => {
      expect(toCron('every wed')).toBe('0 0 0 * * wed');
    });

    it('should parse every thursday', () => {
      expect(toCron('every thursday')).toBe('0 0 0 * * thursday');
    });

    it('should parse every thu', () => {
      expect(toCron('every thu')).toBe('0 0 0 * * thu');
    });

    it('should parse every friday', () => {
      expect(toCron('every friday')).toBe('0 0 0 * * friday');
    });

    it('should parse every fri', () => {
      expect(toCron('every fri')).toBe('0 0 0 * * fri');
    });

    it('should parse every saturday', () => {
      expect(toCron('every saturday')).toBe('0 0 0 * * saturday');
    });

    it('should parse every sat', () => {
      expect(toCron('every sat')).toBe('0 0 0 * * sat');
    });

    it('should parse every sat on hour 3', () => {
      expect(toCron('every sat on hour 3')).toBe('0 0 3 * * sat');
    });

    it('should parse every friday on day 13 on hour 0', () => {
      expect(toCron('every friday on day 13 on hour 0')).toBe('0 0 0 13 * friday');
    });

    it('should translate every friday on hour 3', () => {
      expect(toCron('every friday on hour 3')).toBe('0 0 3 * * friday');
    });

    it('should translate every hour 3 every friday', () => {
      expect(toCron('every hour 3 every friday')).toBe('0 0 3 * * friday');
    });

    it('should translate every mon,sat', () => {
      expect(toCron('every mon,sat')).toBe('0 0 0 * * mon,sat');
    });

    it('should translate every monday,saturday', () => {
      expect(toCron('every monday,saturday')).toBe('0 0 0 * * monday,saturday');
    });

    it('should translate from week day 1 to 4', () => {
      expect(toCron('from week day 1 to 4')).toBe('0 0 0 * * 1-4');
    });

    it('should translate from mon to wed', () => {
      expect(toCron('from mon to wed')).toBe('0 0 0 * * mon-wed');
    });
  });
});
