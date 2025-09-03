import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Time formatting and parsing utilities
export function formatTime(hours: number, minutes: number, seconds: number): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function parseTimeString(timeString: string): { hours: number; minutes: number; seconds: number } {
  const parts = timeString.split(':');
  return {
    hours: parseInt(parts[0]) || 0,
    minutes: parseInt(parts[1]) || 0,
    seconds: parseInt(parts[2]) || 0
  };
}

export function timeToMinutes(hours: number, minutes: number, seconds: number): number {
  return hours * 60 + minutes + seconds / 60;
}

export function minutesToTime(totalMinutes: number): { hours: number; minutes: number; seconds: number } {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const seconds = Math.round((totalMinutes % 1) * 60);
  return { hours, minutes, seconds };
}

// Date validation utilities
export function isValidFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
}

export function isWithinSixMonths(date: Date): boolean {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const today = new Date();
  return date >= sixMonthsAgo && date <= today;
}

export function calculateWeeksUntilRace(raceDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const race = new Date(raceDate);
  race.setHours(0, 0, 0, 0);
  
  const timeDiff = race.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return Math.max(1, Math.ceil(daysDiff / 7)); // Minimum 1 week
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Distance and pace utilities
export function calculatePace(distance: number, hours: number, minutes: number, seconds: number): number {
  const totalMinutes = timeToMinutes(hours, minutes, seconds);
  return totalMinutes / distance; // minutes per km
}

export function formatPace(pacePerKm: number): string {
  const minutes = Math.floor(pacePerKm);
  const seconds = Math.round((pacePerKm % 1) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
}

export function getDistanceInKm(distance: '5km' | '10km' | 'Half' | 'Full'): number {
  const distances = {
    '5km': 5,
    '10km': 10,
    'Half': 21.1,
    'Full': 42.2
  };
  return distances[distance];
}

// Form validation helpers
export function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

export function isValidNumber(value: string): boolean {
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num);
}

export function parseNumber(value: string): number {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return '알 수 없는 오류가 발생했습니다';
}

export function formatValidationErrors(errors: Record<string, string[]>): string {
  return Object.values(errors)
    .flat()
    .join(', ');
}