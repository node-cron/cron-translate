import { describe, it, expect } from 'vitest';
import { toCron } from '../src/index';

describe('toCron', () => {
  describe('invalid expression', () => {
    it('should fail with invalid value', () => {
      expect(() => toCron('every invalid')).toThrow('Invalid expression!');
    });

    it('should fail on invalid command', () => {
      expect(() => toCron('invalid expression')).toThrow('invalid expression at invalid');
    });

    it('should fail on trailing invalid command', () => {
      expect(() => toCron('every day 2 invalid')).toThrow('invalid expression at invalid');
    });
  });
});
