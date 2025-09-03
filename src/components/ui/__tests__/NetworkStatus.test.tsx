import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import NetworkStatus from '../NetworkStatus';

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

describe('NetworkStatus', () => {
  beforeEach(() => {
    // Reset navigator.onLine to true
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  it('does not render when online', () => {
    const { container } = render(<NetworkStatus />);
    expect(container.firstChild).toBeNull();
  });

  it('renders offline message when offline', () => {
    // Set offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    render(<NetworkStatus />);

    // Trigger offline event
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(screen.getByText('인터넷 연결이 끊어졌습니다')).toBeInTheDocument();
  });

  it('shows retry button when onRetry is provided', () => {
    const mockRetry = jest.fn();

    // Set offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    render(<NetworkStatus onRetry={mockRetry} />);

    // Trigger offline event
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    const retryButton = screen.getByText('다시 시도');
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('does not show retry button when onRetry is not provided', () => {
    // Set offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    render(<NetworkStatus />);

    // Trigger offline event
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(screen.queryByText('다시 시도')).not.toBeInTheDocument();
  });

  it('hides message when coming back online', () => {
    // Start offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    const { container } = render(<NetworkStatus />);

    // Trigger offline event
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(screen.getByText('인터넷 연결이 끊어졌습니다')).toBeInTheDocument();

    // Go back online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(container.firstChild).toBeNull();
  });

  it('handles initial offline state', () => {
    // Set offline before rendering
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    render(<NetworkStatus />);

    // Trigger offline event to show message
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    // Should show offline message
    expect(screen.getByText('인터넷 연결이 끊어졌습니다')).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<NetworkStatus />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });
});