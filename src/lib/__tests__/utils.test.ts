
import {
  formatTime,
  parseTimeString,
  timeToMinutes,
  minutesToTime,
  isValidFutureDate,
  isWithinSixMonths,
  calculateWeeksUntilRace,
  formatDate,
  calculatePace,
  formatPace,
  getDistanceInKm,
  sanitizeInput,
  isValidNumber,
  parseNumber,
  getErrorMessage,
  formatValidationErrors
} from '../utils';

describe('Time utilities', () => {
  describe('formatTime', () => {
    it('formats time correctly with padding', () => {
      expect(formatTime(1, 5, 30)).toBe('01:05:30');
      expect(formatTime(0, 0, 0)).toBe('00:00:00');
      expect(formatTime(23, 59, 59)).toBe('23:59:59');
    });
  });

  describe('parseTimeString', () => {
    it('parses time string correctly', () => {
      expect(parseTimeString('01:05:30')).toEqual({ hours: 1, minutes: 5, seconds: 30 });
      expect(parseTimeString('0:0:0')).toEqual({ hours: 0, minutes: 0, seconds: 0 });
    });

    it('handles invalid input gracefully', () => {
      expect(parseTimeString('invalid')).toEqual({ hours: 0, minutes: 0, seconds: 0 });
      expect(parseTimeString('1:2')).toEqual({ hours: 1, minutes: 2, seconds: 0 });
    });
  });

  describe('timeToMinutes', () => {
    it('converts time to minutes correctly', () => {
      expect(timeToMinutes(1, 30, 0)).toBe(90);
      expect(timeToMinutes(0, 45, 30)).toBe(45.5);
      expect(timeToMinutes(2, 0, 0)).toBe(120);
    });
  });

  describe('minutesToTime', () => {
    it('converts minutes to time correctly', () => {
      expect(minutesToTime(90)).toEqual({ hours: 1, minutes: 30, seconds: 0 });
      expect(minutesToTime(45.5)).toEqual({ hours: 0, minutes: 45, seconds: 30 });
    });
  });
});

describe('Date utilities', () => {
  describe('isValidFutureDate', () => {
    it('returns true for future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(isValidFutureDate(futureDate)).toBe(true);
    });

    it('returns false for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(isValidFutureDate(pastDate)).toBe(false);
    });

    it('returns false for today', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day
      expect(isValidFutureDate(today)).toBe(false);
    });
  });

  describe('isWithinSixMonths', () => {
    it('returns true for dates within 6 months', () => {
      const recentDate = new Date();
      recentDate.setMonth(recentDate.getMonth() - 3);
      expect(isWithinSixMonths(recentDate)).toBe(true);
    });

    it('returns false for dates older than 6 months', () => {
      const oldDate = new Date();
      oldDate.setMonth(oldDate.getMonth() - 7);
      expect(isWithinSixMonths(oldDate)).toBe(false);
    });

    it('returns true for today', () => {
      const today = new Date();
      expect(isWithinSixMonths(today)).toBe(true);
    });
  });

  describe('calculateWeeksUntilRace', () => {
    it('calculates weeks correctly', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 14); // 2 weeks from now
      expect(calculateWeeksUntilRace(futureDate)).toBe(2);
    });

    it('returns minimum 1 week', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(calculateWeeksUntilRace(tomorrow)).toBe(1);
    });
  });

  describe('formatDate', () => {
    it('formats date in Korean locale', () => {
      const date = new Date('2025-12-25');
      const formatted = formatDate(date);
      expect(formatted).toContain('2025');
      expect(formatted).toContain('12');
      expect(formatted).toContain('25');
    });
  });
});

describe('Distance and pace utilities', () => {
  describe('calculatePace', () => {
    it('calculates pace correctly', () => {
      expect(calculatePace(10, 0, 50, 0)).toBe(5); // 5 min/km
      expect(calculatePace(5, 0, 25, 0)).toBe(5); // 5 min/km
    });
  });

  describe('formatPace', () => {
    it('formats pace correctly', () => {
      expect(formatPace(5)).toBe('5:00/km');
      expect(formatPace(4.5)).toBe('4:30/km');
      expect(formatPace(6.25)).toBe('6:15/km');
    });
  });

  describe('getDistanceInKm', () => {
    it('returns correct distances', () => {
      expect(getDistanceInKm('5km')).toBe(5);
      expect(getDistanceInKm('10km')).toBe(10);
      expect(getDistanceInKm('Half')).toBe(21.1);
      expect(getDistanceInKm('Full')).toBe(42.2);
    });
  });
});

describe('Form validation helpers', () => {
  describe('sanitizeInput', () => {
    it('trims and normalizes whitespace', () => {
      expect(sanitizeInput('  hello   world  ')).toBe('hello world');
      expect(sanitizeInput('test\n\nstring')).toBe('test string');
    });
  });

  describe('isValidNumber', () => {
    it('validates numbers correctly', () => {
      expect(isValidNumber('123')).toBe(true);
      expect(isValidNumber('12.5')).toBe(true);
      expect(isValidNumber('0')).toBe(true);
      expect(isValidNumber('abc')).toBe(false);
      expect(isValidNumber('')).toBe(false);
    });
  });

  describe('parseNumber', () => {
    it('parses valid numbers', () => {
      expect(parseNumber('123')).toBe(123);
      expect(parseNumber('12.5')).toBe(12.5);
      expect(parseNumber('0')).toBe(0);
    });

    it('returns 0 for invalid input', () => {
      expect(parseNumber('abc')).toBe(0);
      expect(parseNumber('')).toBe(0);
    });
  });
});

describe('Error handling utilities', () => {
  describe('getErrorMessage', () => {
    it('extracts message from Error objects', () => {
      const error = new Error('Test error');
      expect(getErrorMessage(error)).toBe('Test error');
    });

    it('returns string errors as-is', () => {
      expect(getErrorMessage('String error')).toBe('String error');
    });

    it('returns default message for unknown errors', () => {
      expect(getErrorMessage(null)).toBe('알 수 없는 오류가 발생했습니다');
      expect(getErrorMessage(undefined)).toBe('알 수 없는 오류가 발생했습니다');
    });
  });

  describe('formatValidationErrors', () => {
    it('formats validation errors correctly', () => {
      const errors = {
        name: ['Name is required'],
        email: ['Email is invalid', 'Email is required']
      };
      expect(formatValidationErrors(errors)).toBe('Name is required, Email is invalid, Email is required');
    });

    it('handles empty errors', () => {
      expect(formatValidationErrors({})).toBe('');
    });
  });
});