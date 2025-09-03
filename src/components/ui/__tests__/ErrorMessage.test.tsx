import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorMessage, { getErrorType } from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('renders network error message', () => {
    render(<ErrorMessage type="network" />);

    expect(screen.getByText('📡')).toBeInTheDocument();
    expect(screen.getByText('네트워크 연결을 확인해주세요')).toBeInTheDocument();
    expect(screen.getByText('인터넷 연결 상태를 확인하고 다시 시도해주세요')).toBeInTheDocument();
  });

  it('renders validation error message', () => {
    render(<ErrorMessage type="validation" />);

    expect(screen.getByText('⚠️')).toBeInTheDocument();
    expect(screen.getByText('입력한 정보를 다시 확인해주세요')).toBeInTheDocument();
  });

  it('renders API error message', () => {
    render(<ErrorMessage type="api" />);

    expect(screen.getByText('🤖')).toBeInTheDocument();
    expect(screen.getByText('AI 서비스에 일시적인 문제가 발생했습니다')).toBeInTheDocument();
  });

  it('renders timeout error message', () => {
    render(<ErrorMessage type="timeout" />);

    expect(screen.getByText('⏰')).toBeInTheDocument();
    expect(screen.getByText('요청 시간이 초과되었습니다')).toBeInTheDocument();
  });

  it('renders server error message', () => {
    render(<ErrorMessage type="server" />);

    expect(screen.getByText('🔧')).toBeInTheDocument();
    expect(screen.getByText('서버에 문제가 발생했습니다')).toBeInTheDocument();
  });

  it('renders unknown error message', () => {
    render(<ErrorMessage type="unknown" />);

    expect(screen.getByText('❌')).toBeInTheDocument();
    expect(screen.getByText('예상치 못한 오류가 발생했습니다')).toBeInTheDocument();
  });

  it('renders custom message when provided', () => {
    const customMessage = 'Custom error message';
    render(<ErrorMessage type="network" message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('shows retry button and calls onRetry', () => {
    const mockRetry = jest.fn();
    render(<ErrorMessage type="network" onRetry={mockRetry} />);

    const retryButton = screen.getByText('다시 시도');
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('shows dismiss button and calls onDismiss', () => {
    const mockDismiss = jest.fn();
    render(<ErrorMessage type="network" onDismiss={mockDismiss} />);

    const dismissButton = screen.getByText('닫기');
    expect(dismissButton).toBeInTheDocument();

    fireEvent.click(dismissButton);
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it('shows X button and calls onDismiss', () => {
    const mockDismiss = jest.fn();
    render(<ErrorMessage type="network" onDismiss={mockDismiss} />);

    const xButton = screen.getByRole('button', { name: '' }); // X button has no text
    fireEvent.click(xButton);
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders children when provided', () => {
    render(
      <ErrorMessage type="network">
        <div>Custom content</div>
      </ErrorMessage>
    );

    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ErrorMessage type="network" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('getErrorType', () => {
  it('returns network for network-related errors', () => {
    expect(getErrorType({ message: 'network error' })).toBe('network');
    expect(getErrorType({ message: 'fetch failed' })).toBe('network');
  });

  it('returns network when offline', () => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    expect(getErrorType({ message: 'some error' })).toBe('network');

    // Restore
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  it('returns timeout for timeout errors', () => {
    expect(getErrorType({ message: 'timeout occurred' })).toBe('timeout');
    expect(getErrorType({ status: 408 })).toBe('timeout');
  });

  it('returns validation for validation errors', () => {
    expect(getErrorType({ message: 'validation failed' })).toBe('validation');
    expect(getErrorType({ status: 400 })).toBe('validation');
  });

  it('returns server for server errors', () => {
    expect(getErrorType({ status: 500 })).toBe('server');
    expect(getErrorType({ status: 502 })).toBe('server');
  });

  it('returns api for client errors', () => {
    expect(getErrorType({ status: 401 })).toBe('api');
    expect(getErrorType({ status: 403 })).toBe('api');
    expect(getErrorType({ status: 404 })).toBe('api');
  });

  it('returns unknown for unrecognized errors', () => {
    expect(getErrorType({ message: 'random error' })).toBe('unknown');
    expect(getErrorType({})).toBe('unknown');
    expect(getErrorType(null)).toBe('unknown');
    expect(getErrorType(undefined)).toBe('unknown');
  });
});