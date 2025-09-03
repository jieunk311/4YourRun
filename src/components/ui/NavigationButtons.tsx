'use client';

import { ReactNode } from 'react';
import { useTouchFeedback } from '@/hooks/useTouchFeedback';

interface NavigationButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}

export function NavigationButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = ''
}: NavigationButtonProps) {
  const { isPressed, touchProps } = useTouchFeedback({
    hapticFeedback: !disabled,
    visualFeedback: !disabled
  });

  const baseClasses = 'w-full min-h-[44px] px-6 py-3 rounded-lg font-medium text-base transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation select-none';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-300 disabled:text-gray-500 active:bg-blue-800',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-400 active:bg-gray-400'
  };

  const pressedClasses = isPressed && !disabled ? 'scale-95 shadow-inner' : 'scale-100 shadow-md';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${pressedClasses} ${className}`}
      {...touchProps}
    >
      {children}
    </button>
  );
}

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  showBack?: boolean;
  nextDisabled?: boolean;
  nextType?: 'button' | 'submit';
  loading?: boolean;
}

export default function NavigationButtons({
  onBack,
  onNext,
  nextLabel = '다음',
  backLabel = '이전',
  showBack = true,
  nextDisabled = false,
  nextType = 'button',
  loading = false
}: NavigationButtonsProps) {
  return (
    <div className="space-y-3 mt-8">
      <NavigationButton
        type={nextType}
        onClick={onNext}
        disabled={nextDisabled || loading}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>처리중...</span>
          </div>
        ) : (
          nextLabel
        )}
      </NavigationButton>
      {showBack && (
        <NavigationButton
          variant="secondary"
          onClick={onBack}
          disabled={loading}
        >
          {backLabel}
        </NavigationButton>
      )}
    </div>
  );
}