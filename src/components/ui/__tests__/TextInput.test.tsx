import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from '../TextInput';

describe('TextInput', () => {
  it('renders with correct initial value', () => {
    render(<TextInput value="test value" />);
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<TextInput label="이름" value="" />);
    expect(screen.getByText('이름')).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const onChange = jest.fn();
    render(<TextInput value="" onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(onChange).toHaveBeenCalled();
  });

  it('displays error message when provided', () => {
    render(<TextInput value="" error="필수 입력 항목입니다" />);
    expect(screen.getByText('필수 입력 항목입니다')).toBeInTheDocument();
  });

  it('displays helper text when provided and no error', () => {
    render(<TextInput value="" helperText="도움말 텍스트" />);
    expect(screen.getByText('도움말 텍스트')).toBeInTheDocument();
  });

  it('hides helper text when error is shown', () => {
    render(
      <TextInput 
        value="" 
        error="오류 메시지" 
        helperText="도움말 텍스트" 
      />
    );
    expect(screen.getByText('오류 메시지')).toBeInTheDocument();
    expect(screen.queryByText('도움말 텍스트')).not.toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(<TextInput value="" disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<TextInput ref={ref} value="" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes through additional props', () => {
    render(<TextInput value="" placeholder="입력하세요" maxLength={10} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', '입력하세요');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('applies error styles when error is provided', () => {
    render(<TextInput value="" error="오류" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
  });

  it('applies disabled styles when disabled', () => {
    render(<TextInput value="" disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('bg-gray-100', 'text-gray-500');
  });
});