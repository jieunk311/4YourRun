'use client';

import { useCallback, useState } from 'react';

interface TouchFeedbackOptions {
  hapticFeedback?: boolean;
  visualFeedback?: boolean;
  feedbackDuration?: number;
}

export function useTouchFeedback({
  hapticFeedback = true,
  visualFeedback = true,
  feedbackDuration = 150
}: TouchFeedbackOptions = {}) {
  const [isPressed, setIsPressed] = useState(false);

  const triggerHapticFeedback = useCallback(() => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10); // Short vibration
    }
  }, [hapticFeedback]);

  const handleTouchStart = useCallback(() => {
    if (visualFeedback) {
      setIsPressed(true);
    }
    triggerHapticFeedback();
  }, [visualFeedback, triggerHapticFeedback]);

  const handleTouchEnd = useCallback(() => {
    if (visualFeedback) {
      setTimeout(() => setIsPressed(false), feedbackDuration);
    }
  }, [visualFeedback, feedbackDuration]);

  const touchProps = {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleTouchStart,
    onMouseUp: handleTouchEnd,
    onMouseLeave: handleTouchEnd
  };

  return {
    isPressed,
    touchProps,
    triggerHapticFeedback
  };
}