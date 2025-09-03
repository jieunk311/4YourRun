'use client';

interface ProgressIndicatorProps {
  currentStep: 1 | 2 | 'loading' | 'result';
}

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = [
    { key: 1, label: 'Step 1', description: '마라톤 정보' },
    { key: 2, label: 'Step 2', description: '러닝 기록' },
    { key: 'loading', label: 'Loading', description: '계획 생성' },
    { key: 'result', label: 'Result', description: '훈련 계획' }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(s => s.key === currentStep);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-md px-4 py-3">
        {/* Mobile optimized progress bar */}
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    step.key === currentStep
                      ? step.key === 'loading'
                        ? 'bg-yellow-500 text-white animate-pulse'
                        : 'bg-blue-600 text-white'
                      : index < currentStepIndex
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index < currentStepIndex 
                    ? '✓' 
                    : step.key === 'loading' && step.key === currentStep
                    ? '⏳'
                    : typeof step.key === 'number' 
                    ? step.key 
                    : step.key === currentStep 
                    ? '✓' 
                    : '✓'}
                </div>
                <span className="mt-1 text-xs font-medium text-gray-700 text-center">
                  {step.description}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`flex-1 h-0.5 mx-2 transition-colors ${
                    index < currentStepIndex ? 'bg-green-600' : 'bg-gray-200'
                  }`} 
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Progress percentage */}
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
            style={{ 
              width: `${((currentStepIndex + 1) / steps.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
}