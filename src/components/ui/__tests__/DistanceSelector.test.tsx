import { render, screen, fireEvent } from '@testing-library/react';
import DistanceSelector from '../DistanceSelector';

describe('DistanceSelector', () => {
  const defaultProps = {
    value: '10km' as const,
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct initial value', () => {
    render(<DistanceSelector {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('10km');
  });

  it('renders with label', () => {
    render(<DistanceSelector {...defaultProps} label="거리 선택" />);
    expect(screen.getByText('거리 선택')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<DistanceSelector {...defaultProps} error="거리를 선택해주세요" />);
    expect(screen.getByText('거리를 선택해주세요')).toBeInTheDocument();
  });

  it('shows placeholder when no value is selected', () => {
    render(<DistanceSelector value={null} onChange={defaultProps.onChange} />);
    expect(screen.getByText('거리를 선택하세요')).toBeInTheDocument();
  });

  it('opens dropdown when button is clicked', () => {
    render(<DistanceSelector {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByRole('option', { name: /5km/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /하프 마라톤/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /풀 마라톤/ })).toBeInTheDocument();
  });

  it('calls onChange when option is selected', () => {
    render(<DistanceSelector {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const option = screen.getByRole('option', { name: /5km/ });
    fireEvent.click(option);
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('5km');
  });

  it('closes dropdown after selection', () => {
    render(<DistanceSelector {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const option = screen.getByRole('option', { name: /5km/ });
    fireEvent.click(option);
    
    // Check that dropdown is closed by checking aria-expanded
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <DistanceSelector {...defaultProps} />
        <div data-testid="outside">Outside element</div>
      </div>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Dropdown should be open
    expect(button).toHaveAttribute('aria-expanded', 'true');
    
    const outsideElement = screen.getByTestId('outside');
    fireEvent.mouseDown(outsideElement);
    
    // Dropdown should be closed
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('highlights selected option in dropdown', () => {
    render(<DistanceSelector {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const selectedOption = screen.getByRole('option', { name: /10km/ });
    expect(selectedOption).toHaveClass('bg-blue-100');
  });

  it('disables button when disabled prop is true', () => {
    render(<DistanceSelector {...defaultProps} disabled />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not open dropdown when disabled', () => {
    render(<DistanceSelector {...defaultProps} disabled />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Dropdown should not open
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows chevron icon that rotates when open', () => {
    render(<DistanceSelector {...defaultProps} />);
    
    const button = screen.getByRole('button');
    const chevron = button.querySelector('svg');
    
    expect(chevron).toBeInTheDocument();
    expect(chevron).not.toHaveClass('rotate-180');
    
    fireEvent.click(button);
    expect(chevron).toHaveClass('rotate-180');
  });
});