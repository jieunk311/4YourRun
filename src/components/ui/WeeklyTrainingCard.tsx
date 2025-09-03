'use client';

import { useState } from 'react';
import { TrainingWeek } from '@/types';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { useTouchFeedback } from '@/hooks/useTouchFeedback';

interface WeeklyTrainingCardProps {
  trainingWeek: TrainingWeek;
  onExpand?: () => void;
  isExpanded?: boolean;
}

export default function WeeklyTrainingCard({ 
  trainingWeek, 
  onExpand,
  isExpanded = false 
}: WeeklyTrainingCardProps) {
  const [localExpanded, setLocalExpanded] = useState(isExpanded);
  const { touchProps } = useTouchFeedback();

  const handleToggleExpand = () => {
    if (onExpand) {
      onExpand();
    } else {
      setLocalExpanded(!localExpanded);
    }
  };

  const swipeGesture = useSwipeGesture({
    onSwipeUp: () => setLocalExpanded(true),
    onSwipeDown: () => setLocalExpanded(false),
    threshold: 30
  });

  const expanded = onExpand ? isExpanded : localExpanded;

  return (
    <div 
      className="bg-white rounded-lg shadow-md border border-gray-200 touch-manipulation transition-all duration-300 hover:shadow-lg"
      {...swipeGesture}
    >
      <div 
        className="p-4 cursor-pointer select-none"
        onClick={handleToggleExpand}
        {...touchProps}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Week {trainingWeek.week}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {trainingWeek.totalDistance}km
            </div>
            <div className={`transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className={`space-y-3 overflow-hidden transition-all duration-300 ${
          expanded ? 'max-h-96 opacity-100' : 'max-h-16 opacity-70'
        }`}>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Training Composition</h4>
            <p className="text-gray-800 text-sm leading-relaxed">
              {trainingWeek.trainingComposition}
            </p>
          </div>
          
          {expanded && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">Training Objectives</h4>
              <p className="text-gray-800 text-sm leading-relaxed">
                {trainingWeek.objectives}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Swipe indicator */}
      <div className="px-4 pb-2">
        <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto opacity-50"></div>
      </div>
    </div>
  );
}