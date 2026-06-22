import { describe, it, expect } from 'vitest';
import { toCron } from '../src/index';

describe('toCron', () => {
  describe('minute', () => {
    it('should parse every minute', () => {
      expect(toCron('every minute')).toBe('0 * * * * *');
    });

    it('should parse every 2 minutes', () => {
      expect(toCron('every 2 minutes')).toBe('0 */2 * * * *');
    });

    it('should translate on minute 4', () => {
      expect(toCron('on minute 4')).toBe('0 4 * * * *');
    });

    it('should translate every minute 4', () => {
      expect(toCron('every minute 4')).toBe('0 4 * * * *');
    });

    it('should translate on minute 4,5,6', () => {
      expect(toCron('on minute 4,5,6')).toBe('0 4,5,6 * * * *');
    });

    it('should translate every minute 4,5,6', () => {
      expect(toCron('every minute 4,5,6')).toBe('0 4,5,6 * * * *');
    });

    it('should translate every minute on second 2', () => {
      expect(toCron('every minute on second 2')).toBe('2 * * * * *');
    });

    it('should translate every minute 5 on second 2', () => {
      expect(toCron('every minute 5 on second 2')).toBe('2 5 * * * *');
    });

    it('should translate every minute 5 every 2 seconds', () => {
      expect(toCron('every minute 5 every 2 seconds')).toBe('*/2 5 * * * *');
    });

    it('should translate on minute 5 every 2 seconds', () => {
      expect(toCron('on minute 5 every 2 seconds')).toBe('*/2 5 * * * *');
    });

    it('should translate from minute 1 to 30', () => {
      expect(toCron('from minute 1 to 30')).toBe('0 1-30 * * * *');
    });
  });
});
