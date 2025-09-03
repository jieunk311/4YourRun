'use client';

import { TrainingPlan } from '@/types';
import TrainingSummary from './TrainingSummary';
import WeeklyTrainingCard from './WeeklyTrainingCard';

interface TrainingPlanDisplayProps {
  trainingPlan: TrainingPlan;
  marathonName?: string;
  targetTime?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export default function TrainingPlanDisplay({ 
  trainingPlan, 
  marathonName,
  targetTime 
}: TrainingPlanDisplayProps) {
  return (
    <div className="space-y-6" data-testid="training-plan-display">
      {/* Header Section */}
      {marathonName && (
        <div className="text-center bg-white rounded-lg p-6 shadow-sm border border-gray-200" data-testid="plan-header">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🎉 훈련 계획 완성!
          </h1>
          <p className="text-gray-600 mb-4">
            {marathonName}을 위한 맞춤형 계획
          </p>
          {targetTime && (
            <div className="text-sm text-gray-500" data-testid="target-time">
              목표 시간: {targetTime.hours}:
              {String(targetTime.minutes).padStart(2, '0')}:
              {String(targetTime.seconds).padStart(2, '0')}
            </div>
          )}
        </div>
      )}

      {/* Training Plan Summary */}
      <TrainingSummary trainingPlan={trainingPlan} />

      {/* Weekly Training Cards */}
      <div className="space-y-4" data-testid="weekly-cards-section">
        <h2 className="text-xl font-bold text-gray-800 px-2">
          주차별 훈련 계획
        </h2>
        <div className="space-y-4 max-h-96 overflow-y-auto overscroll-contain scroll-smooth scroll-container" data-testid="weekly-cards-container">
          {trainingPlan.weeks.map((week) => (
            <WeeklyTrainingCard 
              key={week.week} 
              trainingWeek={week} 
            />
          ))}
        </div>
      </div>

      {/* AI Feedback Section */}
      {trainingPlan.aiFeedback && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 shadow-sm" data-testid="ai-feedback">
          <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            AI 추천사항 및 팁
          </h2>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {trainingPlan.aiFeedback}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}