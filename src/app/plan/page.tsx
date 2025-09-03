'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MarathonInfo, RunningRecord } from '@/lib/validations';
import { MobileLayout } from '@/components/layout';
import { ProgressIndicator } from '@/components/layout';
import { MarathonInfoForm, RunningHistoryForm } from '@/components/forms';
import { ErrorMessage } from '@/components/ui';
import { useAppContext } from '@/contexts/AppContext';
import { getErrorType } from '@/components/ui/ErrorMessage';

type PlanStep = 'marathon-info' | 'running-history';

export default function PlanPage() {
  const router = useRouter();
  const { state, setCurrentStep, setMarathonInfo, setRunningHistory, setTrainingPlan, setHasRunningHistory } = useAppContext();
  const [planStep, setPlanStep] = useState<PlanStep>('marathon-info');
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Initialize the current step when component mounts
    setCurrentStep(planStep === 'marathon-info' ? 'marathon-info' : 'running-history');
  }, []); // Only run on mount

  const handleMarathonInfoSubmit = (data: MarathonInfo) => {
    setMarathonInfo(data);
    setPlanStep('running-history');
    setCurrentStep('running-history'); // Update global step directly
    
    // Clear any previous errors
    setError(null);
  };

  const handleRunningHistorySubmit = async (data: RunningRecord[]) => {
    setRunningHistory(data);
    setHasRunningHistory(data.length > 0);
    
    // Navigate to loading page
    setCurrentStep('loading');
    router.push('/loading');
    
    // Start AI generation in the background
    setTimeout(async () => {
      try {
        // Import the API function dynamically to avoid SSR issues
        const { generateTrainingPlan } = await import('@/lib/api');
        
        // Prepare form data for API
        if (!state.marathonInfo) {
          throw new Error('Marathon information is missing');
        }
        
        const formData = {
          marathonInfo: state.marathonInfo,
          runningHistory: data,
          hasRunningHistory: data.length > 0
        };
        
        // Generate training plan using AI with retry callback
        const trainingPlan = await generateTrainingPlan(formData, (attempt, error) => {
          console.log(`Retry attempt ${attempt}:`, error);
          setRetryCount(attempt);
        });
        
        // Set the training plan in context
        setTrainingPlan(trainingPlan);
        
        // Navigate to results
        router.push('/result');
        
      } catch (error) {
        console.error('Failed to generate training plan:', error);
        
        // Set error state to show error message
        setError(error);
        
        // Navigate back to plan page to show error
        setCurrentStep('running-history');
        router.push('/plan');
      }
    }, 100); // Small delay to ensure navigation happens first
  };

  const handleRetryGeneration = async () => {
    if (!state.marathonInfo || !state.runningHistory) {
      setError(new Error('필요한 정보가 누락되었습니다. 다시 입력해주세요.'));
      return;
    }

    setError(null);
    setRetryCount(0);
    
    // Navigate to loading page
    setCurrentStep('loading');
    router.push('/loading');
    
    // Retry generation
    setTimeout(async () => {
      try {
        const { generateTrainingPlan } = await import('@/lib/api');
        
        const formData = {
          marathonInfo: state.marathonInfo!,
          runningHistory: state.runningHistory,
          hasRunningHistory: state.runningHistory.length > 0
        };
        
        const trainingPlan = await generateTrainingPlan(formData, (attempt, error) => {
          console.log(`Retry attempt ${attempt}:`, error);
          setRetryCount(attempt);
        });
        
        setTrainingPlan(trainingPlan);
        router.push('/result');
        
      } catch (error) {
        console.error('Retry failed:', error);
        setError(error);
        setCurrentStep('running-history');
        router.push('/plan');
      }
    }, 100);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleBackToMarathonInfo = () => {
    setPlanStep('marathon-info');
    setCurrentStep('marathon-info'); // Update global step directly
  };

  const getStepNumber = (): 1 | 2 => {
    switch (planStep) {
      case 'marathon-info':
        return 1;
      case 'running-history':
        return 2;
      default:
        return 1;
    }
  };

  return (
    <MobileLayout>
      <div className="space-y-6">
        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={getStepNumber() as 1 | 2}
        />



        {/* Error Message */}
        {error && (
          <ErrorMessage
            type={getErrorType(error)}
            message={error.message}
            onRetry={handleRetryGeneration}
            onDismiss={() => setError(null)}
          >
            {retryCount > 0 && (
              <p className="text-sm text-red-600 mt-2">
                재시도 중... ({retryCount}/3)
              </p>
            )}
          </ErrorMessage>
        )}

        {/* Step Content */}
        {planStep === 'marathon-info' && (
          <MarathonInfoForm
            initialData={state.marathonInfo || undefined}
            onSubmit={handleMarathonInfoSubmit}
            onBack={handleBackToHome}
          />
        )}

        {planStep === 'running-history' && (
          <RunningHistoryForm
            initialData={state.runningHistory}
            onSubmit={handleRunningHistorySubmit}
            onBack={handleBackToMarathonInfo}
          />
        )}
      </div>
    </MobileLayout>
  );
}