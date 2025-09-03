import { renderHook, act } from '@testing-library/react';
import { useSwipeGesture } from '../useSwipeGesture';

// Mock touch events
const createTouchEvent = (type: string, touches: { clientX: number; clientY: number }[]) => {
  return {
    type,
    targetTouches: touches,
    preventDefault: jest.fn()
  } as React.TouchEvent<HTMLDivElement>;
};

describe('useSwipeGesture', () => {
  let onSwipeLeft: jest.Mock;
  let onSwipeRight: jest.Mock;
  let onSwipeUp: jest.Mock;
  let onSwipeDown: jest.Mock;

  beforeEach(() => {
    onSwipeLeft = jest.fn();
    onSwipeRight = jest.fn();
    onSwipeUp = jest.fn();
    onSwipeDown = jest.fn();
  });

  it('should detect left swipe', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeLeft,
        onSwipeRight,
        onSwipeUp,
        onSwipeDown,
        threshold: 50
      })
    );

    // Start touch at x: 100
    act(() => {
      result.current.onTouchStart(createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]));
    });

    // Move to x: 40 (60px left swipe)
    act(() => {
      result.current.onTouchMove(createTouchEvent('touchmove', [{ clientX: 40, clientY: 100 }]));
    });

    // End touch
    act(() => {
      result.current.onTouchEnd();
    });

    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
    expect(onSwipeRight).not.toHaveBeenCalled();
    expect(onSwipeUp).not.toHaveBeenCalled();
    expect(onSwipeDown).not.toHaveBeenCalled();
  });

  it('should detect right swipe', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeLeft,
        onSwipeRight,
        onSwipeUp,
        onSwipeDown,
        threshold: 50
      })
    );

    act(() => {
      result.current.onTouchStart(createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]));
    });

    act(() => {
      result.current.onTouchMove(createTouchEvent('touchmove', [{ clientX: 160, clientY: 100 }]));
    });

    act(() => {
      result.current.onTouchEnd();
    });

    expect(onSwipeRight).toHaveBeenCalledTimes(1);
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('should detect up swipe', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeLeft,
        onSwipeRight,
        onSwipeUp,
        onSwipeDown,
        threshold: 50
      })
    );

    act(() => {
      result.current.onTouchStart(createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]));
    });

    act(() => {
      result.current.onTouchMove(createTouchEvent('touchmove', [{ clientX: 100, clientY: 40 }]));
    });

    act(() => {
      result.current.onTouchEnd();
    });

    expect(onSwipeUp).toHaveBeenCalledTimes(1);
    expect(onSwipeDown).not.toHaveBeenCalled();
  });

  it('should not trigger swipe if distance is below threshold', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeLeft,
        onSwipeRight,
        onSwipeUp,
        onSwipeDown,
        threshold: 50
      })
    );

    act(() => {
      result.current.onTouchStart(createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]));
    });

    act(() => {
      result.current.onTouchMove(createTouchEvent('touchmove', [{ clientX: 70, clientY: 100 }]));
    });

    act(() => {
      result.current.onTouchEnd();
    });

    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
    expect(onSwipeUp).not.toHaveBeenCalled();
    expect(onSwipeDown).not.toHaveBeenCalled();
  });

  it('should prevent scroll when preventScroll is true', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeLeft,
        preventScroll: true
      })
    );

    const touchMoveEvent = createTouchEvent('touchmove', [{ clientX: 100, clientY: 100 }]);

    act(() => {
      result.current.onTouchMove(touchMoveEvent);
    });

    expect(touchMoveEvent.preventDefault).toHaveBeenCalled();
  });
});