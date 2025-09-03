import { renderHook } from '@testing-library/react';
import { useIntersectionObserver } from '../useIntersectionObserver';

// Mock IntersectionObserver
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

const mockIntersectionObserver = {
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect
};

beforeAll(() => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => {
    return mockIntersectionObserver;
  });
});

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();
    (global.IntersectionObserver as jest.Mock).mockClear();
  });

  it('should initialize with isIntersecting false', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.targetRef.current).toBe(null);
  });

  it('should return a ref object', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    
    expect(result.current.targetRef).toBeDefined();
    expect(typeof result.current.targetRef).toBe('object');
  });

  it('should accept custom options', () => {
    const { result } = renderHook(() => useIntersectionObserver({
      threshold: 0.5,
      rootMargin: '100px',
      triggerOnce: false
    }));
    
    expect(result.current.isIntersecting).toBe(false);
  });

  it('should handle triggerOnce option', () => {
    const { result } = renderHook(() => useIntersectionObserver({
      triggerOnce: true
    }));
    
    expect(result.current.isIntersecting).toBe(false);
  });

  it('should provide consistent API', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    
    expect(result.current).toHaveProperty('targetRef');
    expect(result.current).toHaveProperty('isIntersecting');
    expect(typeof result.current.isIntersecting).toBe('boolean');
  });
});