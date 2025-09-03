'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/layout';
import { ProgressIndicator } from '@/components/layout';
import { LoadingAnimation, ErrorMessage, NetworkStatus } from '@/components/ui';
import { useAppContext } from '@/contexts/AppContext';
import { getErrorType } from '@/components/ui/ErrorMessage';

export default function LoadingPage() {
  const router = useRouter();
  const { state } = useAppContext();
  const [error, setError] = useState<Error | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    // If we're not in loading state or don't have marathon info, redirect
    if (state.currentStep !== 'loading' || !state.marathonInfo) {
      router.push('/');
      return;
    }

    // If we already have a training plan, redirect to results
    if (state.trainingPlan) {
      router.push('/result');
      return;
    }

    // Set a timeout for loading (30 seconds)
    const timeout = setTimeout(() => {
      setLoadingTimeout(true);
      const timeoutError = new Error('AI 응답 시간이 초과되었습니다. 다시 시도해주세요.');
      setError(timeoutError);
    }, 30000);

    return () => clearTimeout(timeout);
  }, [state.currentStep, state.marathonInfo, state.trainingPlan, router]);

  const handleRetry = () => {
    setError(null);
    setLoadingTimeout(false);
    router.push('/plan');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (error || loadingTimeout) {
    return (
      <MobileLayout>
        <div className="space-y-6">
          {/* Progress Indicator */}
          <ProgressIndicator currentStep="loading" />

          {/* Network Status */}
          <NetworkStatus onRetry={handleRetry} />

          {/* Error Message */}
          <ErrorMessage
            type={getErrorType(error)}
            message={error?.message}
            onRetry={handleRetry}
            onDismiss={handleGoHome}
          >
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                💡 <strong>팁:</strong> 네트워크 상태를 확인하거나 잠시 후 다시 시도해보세요.
              </p>
            </div>
          </ErrorMessage>

          {/* Alternative Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              다른 방법으로 시도해보세요
            </h3>
            <p className="text-gray-600 mb-4">
              AI 서비스에 일시적인 문제가 있을 수 있습니다.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                다시 시도하기
              </button>
              <button
                onClick={handleGoHome}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                처음부터 다시 시작
              </button>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="space-y-6">
        {/* Progress Indicator - showing as loading state */}
        <ProgressIndicator currentStep="loading" />

        {/* Network Status */}
        <NetworkStatus />

        {/* Loading Animation */}
        <LoadingAnimation />

        {/* Loading Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 text-2xl">
              🤖
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">AI가 훈련 계획을 생성하고 있어요</p>
              <p className="text-blue-700">
                입력해주신 정보를 바탕으로 최적의 마라톤 훈련 계획을 만들고 있습니다. 
                잠시만 기다려주세요!
              </p>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}