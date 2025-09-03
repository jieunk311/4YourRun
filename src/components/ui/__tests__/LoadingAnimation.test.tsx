import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingAnimation } from '../LoadingAnimation';

describe('LoadingAnimation', () => {
  it('renders loading text in Korean', () => {
    render(<LoadingAnimation />);
    
    expect(screen.getByText('맞춤형 훈련 계획을 생성하고 있습니다')).toBeInTheDocument();
    expect(screen.getByText('잠시만 기다려주세요...')).toBeInTheDocument();
  });

  it('renders animated runners', () => {
    render(<LoadingAnimation />);
    
    // Check for runner elements (using emoji as content)
    const runners = screen.getAllByText('🏃');
    expect(runners).toHaveLength(3);
    
    // Check that runners are horizontally flipped to face forward
    runners.forEach(runner => {
      expect(runner).toHaveStyle('transform: scaleX(-1)');
    });
  });

  it('renders progress dots', () => {
    const { container } = render(<LoadingAnimation />);
    
    // Check for progress dots (they have animate-pulse class)
    const progressDots = container.querySelectorAll('.animate-pulse');
    expect(progressDots.length).toBeGreaterThanOrEqual(3);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-loading-class';
    const { container } = render(<LoadingAnimation className={customClass} />);
    
    const loadingContainer = container.firstChild as HTMLElement;
    expect(loadingContainer).toHaveClass(customClass);
  });

  it('has proper animation classes for runners', () => {
    const { container } = render(<LoadingAnimation />);
    
    // Check for animation classes
    expect(container.querySelector('.animate-runner-1')).toBeInTheDocument();
    expect(container.querySelector('.animate-runner-2')).toBeInTheDocument();
    expect(container.querySelector('.animate-runner-3')).toBeInTheDocument();
  });

  it('renders track line for runners', () => {
    const { container } = render(<LoadingAnimation />);
    
    // Check for track line (has specific positioning classes)
    const trackLine = container.querySelector('.absolute.bottom-6.left-0.right-0');
    expect(trackLine).toBeInTheDocument();
  });

  it('has minimum height for proper display', () => {
    const { container } = render(<LoadingAnimation />);
    
    const loadingContainer = container.firstChild as HTMLElement;
    expect(loadingContainer).toHaveClass('min-h-[400px]');
  });

  it('renders runners with different colors', () => {
    const { container } = render(<LoadingAnimation />);
    
    // Check for different colored runners
    expect(container.querySelector('.bg-blue-500')).toBeInTheDocument();
    expect(container.querySelector('.bg-green-500')).toBeInTheDocument();
    expect(container.querySelector('.bg-purple-500')).toBeInTheDocument();
  });
});