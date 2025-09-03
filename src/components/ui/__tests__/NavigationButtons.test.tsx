import { render, screen, fireEvent } from '@testing-library/react';
import NavigationButtons, { NavigationButton } from '../NavigationButtons';

describe('NavigationButton', () => {
  it('renders with correct text', () => {
    render(<NavigationButton>Test Button</NavigationButton>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<NavigationButton onClick={handleClick}>Click Me</NavigationButton>);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary variant styles by default', () => {
    render(<NavigationButton>Primary Button</NavigationButton>);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('applies secondary variant styles', () => {
    render(<NavigationButton variant="secondary">Secondary Button</NavigationButton>);
    const button = screen.getByText('Secondary Button');
    expect(button).toHaveClass('bg-gray-200');
  });

  it('is disabled when disabled prop is true', () => {
    render(<NavigationButton disabled>Disabled Button</NavigationButton>);
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
  });

  it('has minimum touch target size', () => {
    render(<NavigationButton>Touch Button</NavigationButton>);
    const button = screen.getByText('Touch Button');
    expect(button).toHaveClass('min-h-[44px]');
  });
});

describe('NavigationButtons', () => {
  it('renders next button with default label', () => {
    render(<NavigationButtons />);
    expect(screen.getByText('다음')).toBeInTheDocument();
  });

  it('renders custom next label', () => {
    render(<NavigationButtons nextLabel="완료" />);
    expect(screen.getByText('완료')).toBeInTheDocument();
  });

  it('shows back button when showBack is true', () => {
    render(<NavigationButtons showBack />);
    expect(screen.getByText('이전')).toBeInTheDocument();
  });

  it('hides back button when showBack is false', () => {
    render(<NavigationButtons showBack={false} />);
    expect(screen.queryByText('이전')).not.toBeInTheDocument();
  });

  it('calls onNext when next button is clicked', () => {
    const handleNext = jest.fn();
    render(<NavigationButtons onNext={handleNext} />);
    
    fireEvent.click(screen.getByText('다음'));
    expect(handleNext).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when back button is clicked', () => {
    const handleBack = jest.fn();
    render(<NavigationButtons onBack={handleBack} showBack />);
    
    fireEvent.click(screen.getByText('이전'));
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('disables next button when nextDisabled is true', () => {
    render(<NavigationButtons nextDisabled />);
    const nextButton = screen.getByText('다음');
    expect(nextButton).toBeDisabled();
  });
});