import { render, screen, fireEvent } from '@testing-library/react';
import DatePicker from '../DatePicker';

describe('DatePicker', () => {
  const defaultProps = {
    value: new Date('2025-12-25'),
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct initial value', () => {
    render(<DatePicker {...defaultProps} />);
    
    const input = screen.getByDisplayValue('2025-12-25') as HTMLInputElement;
    expect(input.value).toBe('2025-12-25');
  });

  it('renders with label', () => {
    render(<DatePicker {...defaultProps} label="대회 날짜" />);
    expect(screen.getByText('대회 날짜')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<DatePicker {...defaultProps} error="날짜를 선택해주세요" />);
    expect(screen.getByText('날짜를 선택해주세요')).toBeInTheDocument();
  });

  it('calls onChange when date is selected', () => {
    render(<DatePicker {...defaultProps} />);
    
    const input = screen.getByDisplayValue('2025-12-25');
    fireEvent.change(input, { target: { value: '2025-11-15' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith(new Date('2025-11-15'));
  });

  it('calls onChange with null when input is cleared', () => {
    render(<DatePicker {...defaultProps} />);
    
    const input = screen.getByDisplayValue('2025-12-25');
    fireEvent.change(input, { target: { value: '' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith(null);
  });

  it('respects minDate constraint', () => {
    const minDate = new Date('2025-01-01');
    render(<DatePicker {...defaultProps} minDate={minDate} />);
    
    const input = screen.getByDisplayValue('2025-12-25') as HTMLInputElement;
    expect(input.min).toBe('2025-01-01');
  });

  it('respects maxDate constraint', () => {
    const maxDate = new Date('2025-12-31');
    render(<DatePicker {...defaultProps} maxDate={maxDate} />);
    
    const input = screen.getByDisplayValue('2025-12-25') as HTMLInputElement;
    expect(input.max).toBe('2025-12-31');
  });

  it('does not call onChange for dates outside min/max range', () => {
    const minDate = new Date('2025-06-01');
    const maxDate = new Date('2025-12-31');
    render(<DatePicker {...defaultProps} minDate={minDate} maxDate={maxDate} />);
    
    const input = screen.getByDisplayValue('2025-12-25');
    
    // Try to set date before minDate
    fireEvent.change(input, { target: { value: '2025-01-01' } });
    expect(defaultProps.onChange).not.toHaveBeenCalled();
    
    // Try to set date after maxDate
    fireEvent.change(input, { target: { value: '2026-01-01' } });
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', () => {
    render(<DatePicker {...defaultProps} disabled />);
    
    const input = screen.getByDisplayValue('2025-12-25');
    expect(input).toBeDisabled();
  });

  it('renders calendar icon', () => {
    const { container } = render(<DatePicker {...defaultProps} />);
    
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('handles null value correctly', () => {
    const { container } = render(<DatePicker value={null} onChange={defaultProps.onChange} />);
    
    const input = container.querySelector('input[type="date"]') as HTMLInputElement;
    expect(input.value).toBe('');
  });
});