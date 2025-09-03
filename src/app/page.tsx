'use client';

import { useRouter } from 'next/navigation';
import MobileLayout from '@/components/layout/MobileLayout';
import { NavigationButton } from '@/components/ui/NavigationButtons';
import { PWAInstallPrompt } from '@/components/ui';
import { useAppContext } from '@/contexts/AppContext';

export default function Home() {
  const router = useRouter();
  const { setCurrentStep, resetState } = useAppContext();

  const handleStart = () => {
    resetState(); // Reset any previous state
    setCurrentStep('marathon-info');
    router.push('/plan');
  };

  return (
    <MobileLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3rem)] text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🏃‍♂️ 4YourRun
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            마라톤 목표 달성을 위한
          </p>
          <p className="text-lg text-gray-600 mb-6">
            AI 기반 개인 맞춤형 러닝 플래너
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8 w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            어떻게 도와드릴까요?
          </h2>
          <ul className="text-left space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              마라톤 목표에 맞는 개인 맞춤형 훈련 계획
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              최근 러닝 기록을 반영한 AI 분석
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              주차별 상세 훈련 가이드 제공
            </li>
            {/* <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              시각적 진행 상황 추적
            </li> */}
          </ul>
        </div>

        <div className="w-full">
          <NavigationButton onClick={handleStart}>
            시작하기
          </NavigationButton>
        </div>
      </div>
      <PWAInstallPrompt />
    </MobileLayout>
  );
}