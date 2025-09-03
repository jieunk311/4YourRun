'use client';

import { ReactNode } from 'react';
import ProgressIndicator from './ProgressIndicator';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  showProgress?: boolean;
  currentStep?: 1 | 2 | 'result';
}

export default function MobileLayout({ 
  children, 
  className = '', 
  showProgress = false,
  currentStep = 1
}: MobileLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {showProgress && <ProgressIndicator currentStep={currentStep} />}
      <div className={`mx-auto max-w-md px-4 ${showProgress ? 'pt-24 pb-6' : 'py-6'}`}>
        {children}
      </div>
    </div>
  );
}