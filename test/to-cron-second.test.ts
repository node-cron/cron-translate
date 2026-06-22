import { describe, it, expect } from 'vitest';
import { toCron } from '../src/index';

describe('toCron', () => {
  describe('second', () => {
    it('should parse every second', () => {
      expect(toCron('every second')).toBe('* * * * * *');
    });

    it('should parse every 2 seconds', () => {
      expect(toCron('every 2 seconds')).toBe('*/2 * * * * *');
    });

    it('should translate on second 4', () => {
      expect(toCron('on second 4')).toBe('4 * * * * *');
    });

    it('should translate every second 4', () => {
      expect(toCron('every second 4')).toBe('4 * * * * *');
    });

    it('should translate on second 4,5,6', () => {
      expect(toCron('on second 4,5,6')).toBe('4,5,6 * * * * *');
    });

    it('should translate every second 4,5,6', () => {
      expect(toCron('every second 4,5,6')).toBe('4,5,6 * * * * *');
    });

    it('should translate from second 1 to 30', () => {
      expect(toCron('from second 1 to 30')).toBe('1-30 * * * * *');
    });
  });
});
