import { describe, it, expect } from 'vitest';
import { toCron } from '../src/index';

describe('toCron', () => {
  describe('hour', () => {
    it('should parse every hour', () => {
      expect(toCron('every hour')).toBe('0 0 * * * *');
    });

    it('should parse every 2 hours', () => {
      expect(toCron('every 2 hours')).toBe('0 0 */2 * * *');
    });

    it('should translate on hour 4', () => {
      expect(toCron('on hour 4')).toBe('0 0 4 * * *');
    });

    it('should translate every hour 4', () => {
      expect(toCron('every hour 4')).toBe('0 0 4 * * *');
    });

    it('should translate on hour 4,5,6', () => {
      expect(toCron('on hour 4,5,6')).toBe('0 0 4,5,6 * * *');
    });

    it('should translate every hour 4,5,6', () => {
      expect(toCron('every hour 4,5,6')).toBe('0 0 4,5,6 * * *');
    });

    it('should translate every hour on minute 2', () => {
      expect(toCron('every hour on minute 2')).toBe('0 2 * * * *');
    });

    it('should translate every hour 5 on minute 2', () => {
      expect(toCron('every hour 5 on minute 2')).toBe('0 2 5 * * *');
    });

    it('should translate every hour 5 every 2 minutes', () => {
      expect(toCron('every hour 5 every 2 minutes')).toBe('0 */2 5 * * *');
    });

    it('should translate on hour 5 every 2 minutes', () => {
      expect(toCron('on hour 5 every 2 minutes')).toBe('0 */2 5 * * *');
    });

    it('should translate on hour 5 every 2 minutes on second 3', () => {
      expect(toCron('on hour 5 every 2 minutes on second 3')).toBe('3 */2 5 * * *');
    });

    it('should translate on hour 5 every 2 minutes every second', () => {
      expect(toCron('on hour 5 every 2 minutes every second')).toBe('* */2 5 * * *');
    });

    it('should translate from hour 1 to 30', () => {
      expect(toCron('from hour 1 to 30')).toBe('0 0 1-30 * * *');
    });
  });
});
