import { render, screen, fireEvent } from '@testing-library/react';
import NumberInput from '../NumberInput';

describe('NumberInput', () => {
  const defaultProps = {
    value: 10,
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct initial value', () => {
    render(<NumberInput {...defaultProps} />);
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<NumberInput {...defaultProps} label="나이" />);
    expect(screen.getByText('나이')).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const onChange = jest.fn();
    render(<NumberInput {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '15' } });
    
    expect(onChange).toHaveBeenCalledWith(15);
  });

  it('handles empty input by calling onChange with 0', () => {
    const onChange = jest.fn();
    render(<NumberInput {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });
    
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('handles invalid input gracefully', () => {
    const onChange = jest.fn();
    render(<NumberInput {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'abc' } });
    
    // Should not call onChange for invalid input
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies min constraint on blur', () => {
    const onChange = jest.fn();
    render(<NumberInput value={5} onChange={onChange} min={10} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.blur(input);
    
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('applies max constraint on blur', () => {
    const onChange = jest.fn();
    render(<NumberInput value={15} onChange={onChange} max={10} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '15' } });
    fireEvent.blur(input);
    
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('displays error message when provided', () => {
    render(<NumberInput {...defaultProps} error="숫자를 입력해주세요" />);
    expect(screen.getByText('숫자를 입력해주세요')).toBeInTheDocument();
  });

  it('displays helper text when provided and no error', () => {
    render(<NumberInput {...defaultProps} helperText="0 이상의 숫자를 입력하세요" />);
    expect(screen.getByText('0 이상의 숫자를 입력하세요')).toBeInTheDocument();
  });

  it('hides helper text when error is shown', () => {
    render(
      <NumberInput 
        {...defaultProps} 
        error="오류 메시지" 
        helperText="도움말 텍스트" 
      />
    );
    expect(screen.getByText('오류 메시지')).toBeInTheDocument();
    expect(screen.queryByText('도움말 텍스트')).not.toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(<NumberInput {...defaultProps} disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('displays unit when provided', () => {
    render(<NumberInput {...defaultProps} unit="kg" />);
    expect(screen.getByText('kg')).toBeInTheDocument();
  });

  it('applies correct padding when unit is present', () => {
    render(<NumberInput {...defaultProps} unit="kg" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('pr-12');
  });

  it('passes through additional props', () => {
    render(<NumberInput {...defaultProps} step={0.5} placeholder="숫자 입력" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('step', '0.5');
    expect(input).toHaveAttribute('placeholder', '숫자 입력');
  });

  it('handles zero value correctly', () => {
    render(<NumberInput value={0} onChange={jest.fn()} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('0');
  });

  it('displays non-zero values correctly', () => {
    render(<NumberInput value={42} onChange={jest.fn()} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('42');
  });

  it('applies error styles when error is provided', () => {
    render(<NumberInput {...defaultProps} error="오류" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
  });

  it('applies disabled styles when disabled', () => {
    render(<NumberInput {...defaultProps} disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('bg-gray-100', 'text-gray-500');
  });
});