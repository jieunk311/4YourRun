'use client';

import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export default function LazySection({
  children,
  fallback,
  className = '',
  threshold = 0.1,
  rootMargin = '100px'
}: LazySectionProps) {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  return (
    <div ref={targetRef} className={className}>
      {isIntersecting ? children : (fallback || <div className="h-32 bg-gray-100 animate-pulse rounded" data-testid="lazy-section-placeholder"></div>)}
    </div>
  );
}