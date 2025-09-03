import { render, screen } from '@testing-library/react';
import ProgressIndicator from '../ProgressIndicator';

describe('ProgressIndicator', () => {
  it('renders all steps correctly', () => {
    render(<ProgressIndicator currentStep={1} />);
    
    expect(screen.getByText('마라톤 정보')).toBeInTheDocument();
    expect(screen.getByText('러닝 기록')).toBeInTheDocument();
    expect(screen.getByText('계획 생성')).toBeInTheDocument();
    expect(screen.getByText('훈련 계획')).toBeInTheDocument();
  });

  it('highlights current step correctly', () => {
    render(<ProgressIndicator currentStep={2} />);
    
    const step2Circle = screen.getByText('2');
    expect(step2Circle).toHaveClass('bg-blue-600');
  });

  it('shows completed steps with checkmark', () => {
    render(<ProgressIndicator currentStep={2} />);
    
    const checkmarks = screen.getAllByText('✓');
    expect(checkmarks.length).toBeGreaterThan(0);
  });

  it('shows correct progress percentage', () => {
    const { container } = render(<ProgressIndicator currentStep={2} />);
    
    const progressBar = container.querySelector('.bg-blue-600.h-1');
    expect(progressBar).toHaveStyle('width: 50%'); // 2/4 steps = 50%
  });

  it('handles loading step correctly', () => {
    render(<ProgressIndicator currentStep="loading" />);
    
    const loadingIcon = screen.getByText('⏳');
    expect(loadingIcon).toHaveClass('bg-yellow-500');
    expect(loadingIcon).toHaveClass('animate-pulse');
  });

  it('handles result step correctly', () => {
    render(<ProgressIndicator currentStep="result" />);
    
    const checkmarks = screen.getAllByText('✓');
    const currentStepCheckmark = checkmarks[checkmarks.length - 1]; // Last checkmark should be current
    expect(currentStepCheckmark).toHaveClass('bg-blue-600');
  });
});