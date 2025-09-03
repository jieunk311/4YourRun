import { renderHook, act } from '@testing-library/react';
import { useTouchFeedback } from '../useTouchFeedback';

// Mock navigator.vibrate
const mockVibrate = jest.fn();
Object.defineProperty(navigator, 'vibrate', {
  value: mockVibrate,
  writable: true
});

describe('useTouchFeedback', () => {
  beforeEach(() => {
    mockVibrate.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should provide touch feedback with haptic and visual feedback', () => {
    const { result } = renderHook(() =>
      useTouchFeedback({
        hapticFeedback: true,
        visualFeedback: true,
        feedbackDuration: 150
      })
    );

    expect(result.current.isPressed).toBe(false);

    // Simulate touch start
    act(() => {
      result.current.touchProps.onTouchStart();
    });

    expect(result.current.isPressed).toBe(true);
    expect(mockVibrate).toHaveBeenCalledWith(10);

    // Simulate touch end
    act(() => {
      result.current.touchProps.onTouchEnd();
    });

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(result.current.isPressed).toBe(false);
  });

  it('should not vibrate when haptic feedback is disabled', () => {
    const { result } = renderHook(() =>
      useTouchFeedback({
        hapticFeedback: false,
        visualFeedback: true
      })
    );

    act(() => {
      result.current.touchProps.onTouchStart();
    });

    expect(mockVibrate).not.toHaveBeenCalled();
  });

  it('should not show visual feedback when disabled', () => {
    const { result } = renderHook(() =>
      useTouchFeedback({
        hapticFeedback: true,
        visualFeedback: false
      })
    );

    act(() => {
      result.current.touchProps.onTouchStart();
    });

    expect(result.current.isPressed).toBe(false);
    expect(mockVibrate).toHaveBeenCalledWith(10);
  });

  it('should handle mouse events as well as touch events', () => {
    const { result } = renderHook(() =>
      useTouchFeedback({
        hapticFeedback: true,
        visualFeedback: true
      })
    );

    // Test mouse down
    act(() => {
      result.current.touchProps.onMouseDown();
    });

    expect(result.current.isPressed).toBe(true);
    expect(mockVibrate).toHaveBeenCalledWith(10);

    // Test mouse up
    act(() => {
      result.current.touchProps.onMouseUp();
    });

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(result.current.isPressed).toBe(false);
  });

  it('should trigger haptic feedback manually', () => {
    const { result } = renderHook(() =>
      useTouchFeedback({
        hapticFeedback: true
      })
    );

    act(() => {
      result.current.triggerHapticFeedback();
    });

    expect(mockVibrate).toHaveBeenCalledWith(10);
  });
});