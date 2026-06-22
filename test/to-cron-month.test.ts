import { describe, it, expect } from 'vitest';
import { toCron } from '../src/index';

describe('toCron', () => {
  describe('month', () => {
    it('should parse every month', () => {
      expect(toCron('every month')).toBe('0 0 0 1 * *');
    });

    it('should parse every 2 months', () => {
      expect(toCron('every 2 months')).toBe('0 0 0 1 */2 *');
    });

    it('should translate on month 4', () => {
      expect(toCron('on month 4')).toBe('0 0 0 1 4 *');
    });

    it('should translate every month 4', () => {
      expect(toCron('every month 4')).toBe('0 0 0 1 4 *');
    });

    it('should translate on month 4,5,6', () => {
      expect(toCron('on month 4,5,6')).toBe('0 0 0 1 4,5,6 *');
    });

    it('should translate every month 4,5,6', () => {
      expect(toCron('every month 4,5,6')).toBe('0 0 0 1 4,5,6 *');
    });

    it('should translate every month on day 2', () => {
      expect(toCron('every month on day 2')).toBe('0 0 0 2 * *');
    });

    it('should translate every month 5 on day 2', () => {
      expect(toCron('every month 5 on day 2')).toBe('0 0 0 2 5 *');
    });

    it('should translate every month 5 every 2 days', () => {
      expect(toCron('every month 5 every 2 days')).toBe('0 0 0 */2 5 *');
    });

    it('should translate on month 5 every 2 days', () => {
      expect(toCron('on month 5 every 2 days')).toBe('0 0 0 */2 5 *');
    });

    it('should translate every month 5 on day 3 every 2 hours on minute 2 on second 30', () => {
      expect(toCron('every month 5 on day 3 every 2 hours on minute 2 on second 30')).toBe('30 2 */2 3 5 *');
    });

    it('should translate using month name', () => {
      expect(toCron('every month jan,feb')).toBe('0 0 0 1 jan,feb *');
    });

    it('should translate every jan', () => {
      expect(toCron('every jan')).toBe('0 0 0 1 jan *');
    });

    it('should translate every january', () => {
      expect(toCron('every january')).toBe('0 0 0 1 january *');
    });

    it('should translate every feb', () => {
      expect(toCron('every feb')).toBe('0 0 0 1 feb *');
    });

    it('should translate every february', () => {
      expect(toCron('every february')).toBe('0 0 0 1 february *');
    });

    it('should translate every mar', () => {
      expect(toCron('every mar')).toBe('0 0 0 1 mar *');
    });

    it('should translate every march', () => {
      expect(toCron('every march')).toBe('0 0 0 1 march *');
    });

    it('should translate every apr', () => {
      expect(toCron('every apr')).toBe('0 0 0 1 apr *');
    });

    it('should translate every april', () => {
      expect(toCron('every april')).toBe('0 0 0 1 april *');
    });

    it('should translate every may', () => {
      expect(toCron('every may')).toBe('0 0 0 1 may *');
    });

    it('should translate every jun', () => {
      expect(toCron('every jun')).toBe('0 0 0 1 jun *');
    });

    it('should translate every june', () => {
      expect(toCron('every june')).toBe('0 0 0 1 june *');
    });

    it('should translate every jul', () => {
      expect(toCron('every jul')).toBe('0 0 0 1 jul *');
    });

    it('should translate every july', () => {
      expect(toCron('every july')).toBe('0 0 0 1 july *');
    });

    it('should translate every aug', () => {
      expect(toCron('every aug')).toBe('0 0 0 1 aug *');
    });

    it('should translate every august', () => {
      expect(toCron('every august')).toBe('0 0 0 1 august *');
    });

    it('should translate every sep', () => {
      expect(toCron('every sep')).toBe('0 0 0 1 sep *');
    });

    it('should translate every september', () => {
      expect(toCron('every september')).toBe('0 0 0 1 september *');
    });

    it('should translate every oct', () => {
      expect(toCron('every oct')).toBe('0 0 0 1 oct *');
    });

    it('should translate every october', () => {
      expect(toCron('every october')).toBe('0 0 0 1 october *');
    });

    it('should translate every nov', () => {
      expect(toCron('every nov')).toBe('0 0 0 1 nov *');
    });

    it('should translate every november', () => {
      expect(toCron('every november')).toBe('0 0 0 1 november *');
    });

    it('should translate every dec', () => {
      expect(toCron('every dec')).toBe('0 0 0 1 dec *');
    });

    it('should translate every december', () => {
      expect(toCron('every december')).toBe('0 0 0 1 december *');
    });

    it('should translate on december', () => {
      expect(toCron('on december')).toBe('0 0 0 1 december *');
    });

    it('should translate every jan,dec', () => {
      expect(toCron('every jan,dec')).toBe('0 0 0 1 jan,dec *');
    });

    it('should translate every january,december', () => {
      expect(toCron('every january,december')).toBe('0 0 0 1 january,december *');
    });

    it('should translate from month 1 to 10', () => {
      expect(toCron('from month 1 to 10')).toBe('0 0 0 1 1-10 *');
    });

    it('should translate from jan to mar', () => {
      expect(toCron('from jan to mar')).toBe('0 0 0 1 jan-mar *');
    });

    it('should translate from month 2 to 6 from hour 2 to 4 every second 42,43,44 on sunday', () => {
      expect(toCron('from month 2 to 6 from hour 2 to 4 every second 42,43,44 on sunday')).toBe('42,43,44 0 2-4 1 2-6 sunday');
    });

    it('should translate a fully combined expression', () => {
      expect(toCron('every second on minute 3 from hour 1 to 5 every 2 days on month 2 every monday')).toBe('* 3 1-5 */2 2 monday');
    });
  });
});
