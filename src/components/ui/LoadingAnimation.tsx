'use client';

import React from 'react';

interface LoadingAnimationProps {
  className?: string;
}

export function LoadingAnimation({ className = '' }: LoadingAnimationProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] ${className}`}>
      {/* Loading Text */}
      <div className="mb-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          맞춤형 훈련 계획을 생성하고 있습니다
        </h2>
        <p className="text-gray-600">
          잠시만 기다려주세요...
        </p>
      </div>

      {/* Animation Container */}
      <div className="relative w-full max-w-md h-20 overflow-hidden bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
        {/* Track Line */}
        <div className="absolute bottom-6 left-0 right-0 h-0.5 bg-gray-300"></div>
        
        {/* Animated Runners */}
        <div className="relative h-full">
          {/* Runner 1 */}
          <div className="absolute bottom-4 animate-runner-1">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              <span style={{ transform: 'scaleX(-1)' }}>🏃</span>
            </div>
          </div>
          
          {/* Runner 2 */}
          <div className="absolute bottom-4 animate-runner-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              <span style={{ transform: 'scaleX(-1)' }}>🏃</span>
            </div>
          </div>
          
          {/* Runner 3 */}
          <div className="absolute bottom-4 animate-runner-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              <span style={{ transform: 'scaleX(-1)' }}>🏃</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex space-x-2 mt-6">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}