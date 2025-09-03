'use client';

import { lazy, Suspense } from 'react';

// Lazy load the LoadingAnimation component
const LoadingAnimation = lazy(() => import('./LoadingAnimation'));

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}

export default function LazyLoadingAnimation() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <LoadingAnimation />
    </Suspense>
  );
}