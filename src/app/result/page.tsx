'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/layout';
import { NavigationButton } from '@/components/ui/NavigationButtons';
import { LazySection } from '@/components/ui';
import { useAppContext } from '@/contexts/AppContext';
import TrainingSummary from '@/components/ui/TrainingSummary';
import WeeklyTrainingCard from '@/components/ui/WeeklyTrainingCard';


export default function ResultPage() {
  const router = useRouter();
  const { state, setCurrentStep, resetState } = useAppContext();

  useEffect(() => {
    setCurrentStep('result');
  }, [setCurrentStep]); // Include setCurrentStep in dependencies

  useEffect(() => {
    // If no training plan data, redirect to home
    if (!state.trainingPlan && !state.marathonInfo) {
      router.push('/');
    }
  }, [state.trainingPlan, state.marathonInfo, router]);

  const handleStartOver = () => {
    resetState();
    router.push('/');
  };

  const handleBackToPlan = () => {
    setCurrentStep('marathon-info');
    router.push('/plan');
  };

  // Show loading state if no training plan yet
  if (!state.trainingPlan) {
    return (
      <MobileLayout showProgress={true} currentStep="result">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] text-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              훈련 계획 생성 중...
            </h1>
            <p className="text-gray-600">
              AI가 맞춤형 훈련 계획을 생성하고 있습니다.
            </p>
          </div>
          
          <div className="w-full space-y-4">
            <NavigationButton onClick={handleBackToPlan}>
              계획 수정하기
            </NavigationButton>
            <NavigationButton onClick={handleStartOver} variant="secondary">
              처음부터 다시
            </NavigationButton>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showProgress={true} currentStep="result">
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="text-center bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🎉 훈련 계획 완성!
          </h1>
          <p className="text-gray-600 mb-4">
            {state.marathonInfo?.raceName}을 위한 맞춤형 계획
          </p>
          <div className="text-sm text-gray-500">
            목표 시간: {state.marathonInfo?.targetTime.hours}:
            {String(state.marathonInfo?.targetTime.minutes).padStart(2, '0')}:
            {String(state.marathonInfo?.targetTime.seconds).padStart(2, '0')}
          </div>
        </div>

        {/* Training Plan Summary */}
        <TrainingSummary trainingPlan={state.trainingPlan} />

        {/* Weekly Training Cards with Scroll Optimization */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 px-2">
            주차별 훈련 계획
          </h2>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto overscroll-contain scroll-smooth scroll-container">
            {state.trainingPlan.weeks.map((week) => (
              <WeeklyTrainingCard 
                key={week.week} 
                trainingWeek={week} 
              />
            ))}
          </div>
        </div>

        {/* AI Feedback Section - Lazy Loaded */}
        {state.trainingPlan.aiFeedback && (
          <LazySection>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 shadow-sm">
              <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                <span className="mr-2">💡</span>
                AI 추천사항 및 팁
              </h2>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {state.trainingPlan.aiFeedback}
                </p>
              </div>
            </div>
          </LazySection>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <NavigationButton onClick={handleBackToPlan}>
            계획 수정하기
          </NavigationButton>
          <NavigationButton onClick={handleStartOver} variant="secondary">
            새로운 계획 만들기
          </NavigationButton>
        </div>
      </div>
    </MobileLayout>
  );
}