import { render, screen, fireEvent } from '@testing-library/react';
import TimeInput from '../TimeInput';

describe('TimeInput', () => {
  const defaultProps = {
    value: { hours: 1, minutes: 30, seconds: 45 },
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct initial values', () => {
    render(<TimeInput {...defaultProps} />);
    
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    expect(screen.getByDisplayValue('45')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<TimeInput {...defaultProps} label="목표 시간" />);
    expect(screen.getByText('목표 시간')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<TimeInput {...defaultProps} error="시간을 입력해주세요" />);
    expect(screen.getByText('시간을 입력해주세요')).toBeInTheDocument();
  });

  it('calls onChange when hours input changes', () => {
    render(<TimeInput {...defaultProps} />);
    
    const hoursInput = screen.getByDisplayValue('1');
    fireEvent.change(hoursInput, { target: { value: '2' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      hours: 2,
      minutes: 30,
      seconds: 45
    });
  });

  it('calls onChange when minutes input changes', () => {
    render(<TimeInput {...defaultProps} />);
    
    const minutesInput = screen.getByDisplayValue('30');
    fireEvent.change(minutesInput, { target: { value: '45' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      hours: 1,
      minutes: 45,
      seconds: 45
    });
  });

  it('calls onChange when seconds input changes', () => {
    render(<TimeInput {...defaultProps} />);
    
    const secondsInput = screen.getByDisplayValue('45');
    fireEvent.change(secondsInput, { target: { value: '30' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      hours: 1,
      minutes: 30,
      seconds: 30
    });
  });

  it('clamps values to valid ranges', () => {
    render(<TimeInput {...defaultProps} />);
    
    const hoursInput = screen.getByDisplayValue('1');
    fireEvent.change(hoursInput, { target: { value: '25' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      hours: 23, // Clamped to max
      minutes: 30,
      seconds: 45
    });
  });

  it('handles empty input gracefully', () => {
    render(<TimeInput {...defaultProps} />);
    
    const hoursInput = screen.getByDisplayValue('1');
    fireEvent.change(hoursInput, { target: { value: '' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      hours: 0,
      minutes: 30,
      seconds: 45
    });
  });

  it('rejects non-numeric input', () => {
    render(<TimeInput {...defaultProps} />);
    
    const hoursInput = screen.getByDisplayValue('1');
    fireEvent.change(hoursInput, { target: { value: 'abc' } });
    
    // Should not call onChange for invalid input
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it('formats values on blur', () => {
    render(<TimeInput {...defaultProps} />);
    
    const minutesInput = screen.getByDisplayValue('30');
    fireEvent.change(minutesInput, { target: { value: '65' } });
    fireEvent.blur(minutesInput);
    
    // Should clamp to 59 and format
    expect(screen.getByDisplayValue('59')).toBeInTheDocument();
  });

  it('disables inputs when disabled prop is true', () => {
    render(<TimeInput {...defaultProps} disabled />);
    
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toBeDisabled();
    });
  });
});