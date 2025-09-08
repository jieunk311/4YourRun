'use client';

import { ReactNode } from 'react';

export type ErrorType = 
  | 'network'
  | 'validation'
  | 'api'
  | 'timeout'
  | 'server'
  | 'unknown';

interface ErrorMessageProps {
  type: ErrorType;
  message?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  children?: ReactNode;
  className?: string;
}

const ERROR_MESSAGES: Record<ErrorType, string> = {
  network: '네트워크 연결을 확인해주세요',
  validation: '입력한 정보를 다시 확인해주세요',
  api: 'AI 서비스에 일시적인 문제가 발생했습니다',
  timeout: '요청 시간이 초과되었습니다',
  server: '서버에 문제가 발생했습니다',
  unknown: '예상치 못한 오류가 발생했습니다'
};

const ERROR_ICONS: Record<ErrorType, string> = {
  network: '📡',
  validation: '⚠️',
  api: '🤖',
  timeout: '⏰',
  server: '🔧',
  unknown: '❌'
};

const ERROR_SUGGESTIONS: Record<ErrorType, string> = {
  network: '인터넷 연결 상태를 확인하고 다시 시도해주세요',
  validation: '모든 필수 항목이 올바르게 입력되었는지 확인해주세요',
  api: 'AI 서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요',
  timeout: '네트워크가 느리거나 서버가 바쁠 수 있습니다. 다시 시도해주세요',
  server: '서버 점검 중이거나 일시적인 문제가 발생했습니다',
  unknown: '문제가 지속되면 페이지를 새로고침해주세요'
};

export default function ErrorMessage({
  type,
  message,
  onRetry,
  onDismiss,
  children,
  className = ''
}: ErrorMessageProps) {
  const displayMessage = message || ERROR_MESSAGES[type];
  const icon = ERROR_ICONS[type];
  const suggestion = ERROR_SUGGESTIONS[type];

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-2xl">
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-red-800 mb-1">
            {displayMessage}
          </h3>
          
          <p className="text-sm text-red-700 mb-3">
            {suggestion}
          </p>
          
          {children && (
            <div className="mb-3">
              {children}
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm bg-red-600 text-white px-3 py-1.5 rounded font-medium hover:bg-red-700 transition-colors"
              >
                다시 시도
              </button>
            )}
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                닫기
              </button>
            )}
          </div>
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// Utility function to determine error type from error message or status
export function getErrorType(error: unknown): ErrorType {
  if (!error) return 'unknown';
  
  const message = (error as { message?: string })?.message?.toLowerCase() || '';
  const status = (error as { status?: number })?.status;
  
  if (message.includes('network') || message.includes('fetch') || !navigator.onLine) {
    return 'network';
  }
  
  if (message.includes('timeout') || status === 408) {
    return 'timeout';
  }
  
  if (message.includes('validation') || status === 400) {
    return 'validation';
  }
  
  if (status && status >= 500) {
    return 'server';
  }
  
  if (status && status >= 400) {
    return 'api';
  }
  
  return 'unknown';
}