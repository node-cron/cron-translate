import { describe, it, expect } from 'vitest';
import { toCron } from '../src/index';

describe('toCron', () => {
  describe('day', () => {
    it('should parse every day', () => {
      expect(toCron('every day')).toBe('0 0 0 * * *');
    });

    it('should parse every 2 days', () => {
      expect(toCron('every 2 days')).toBe('0 0 0 */2 * *');
    });

    it('should translate on day 4', () => {
      expect(toCron('on day 4')).toBe('0 0 0 4 * *');
    });

    it('should translate every day 4', () => {
      expect(toCron('every day 4')).toBe('0 0 0 4 * *');
    });

    it('should translate on day 4,5,6', () => {
      expect(toCron('on day 4,5,6')).toBe('0 0 0 4,5,6 * *');
    });

    it('should translate every day 4,5,6', () => {
      expect(toCron('every day 4,5,6')).toBe('0 0 0 4,5,6 * *');
    });

    it('should translate every day on hour 2', () => {
      expect(toCron('every day on hour 2')).toBe('0 0 2 * * *');
    });

    it('should translate every day 5 on hour 2', () => {
      expect(toCron('every day 5 on hour 2')).toBe('0 0 2 5 * *');
    });

    it('should translate every day 5 every 2 hours', () => {
      expect(toCron('every day 5 every 2 hours')).toBe('0 0 */2 5 * *');
    });

    it('should translate on day 5 every 2 hours', () => {
      expect(toCron('on day 5 every 2 hours')).toBe('0 0 */2 5 * *');
    });

    it('should translate every day 5 on hour 3 on minute 2 on second 30', () => {
      expect(toCron('every day 5 on hour 3 on minute 2 on second 30')).toBe('30 2 3 5 * *');
    });

    it('should translate from day 1 to 10', () => {
      expect(toCron('from day 1 to 10')).toBe('0 0 0 1-10 * *');
    });
  });
});
