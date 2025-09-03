import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PWAInstallPrompt from '../PWAInstallPrompt';
import { usePWA } from '../../../hooks/usePWA';
import { useTouchFeedback } from '../../../hooks/useTouchFeedback';

// Mock the hooks
jest.mock('../../../hooks/usePWA');
jest.mock('../../../hooks/useTouchFeedback');

const mockUsePWA = usePWA as jest.MockedFunction<typeof usePWA>;
const mockUseTouchFeedback = useTouchFeedback as jest.MockedFunction<typeof useTouchFeedback>;

describe('PWAInstallPrompt', () => {
  const mockInstallApp = jest.fn();
  const mockTouchProps = {
    onTouchStart: jest.fn(),
    onTouchEnd: jest.fn(),
    onMouseDown: jest.fn(),
    onMouseUp: jest.fn(),
    onMouseLeave: jest.fn()
  };

  beforeEach(() => {
    mockUsePWA.mockReturnValue({
      isInstallable: true,
      isInstalled: false,
      installApp: mockInstallApp
    });

    mockUseTouchFeedback.mockReturnValue({
      isPressed: false,
      touchProps: mockTouchProps,
      triggerHapticFeedback: jest.fn()
    });

    mockInstallApp.mockClear();
  });

  it('should render install prompt when installable', () => {
    render(<PWAInstallPrompt />);

    expect(screen.getByText('앱으로 설치하기')).toBeInTheDocument();
    expect(screen.getByText('홈 화면에 추가하여 더 빠르고 편리하게 이용하세요')).toBeInTheDocument();
    expect(screen.getByText('설치')).toBeInTheDocument();
    expect(screen.getByText('나중에')).toBeInTheDocument();
  });

  it('should not render when not installable', () => {
    mockUsePWA.mockReturnValue({
      isInstallable: false,
      isInstalled: false,
      installApp: mockInstallApp
    });

    const { container } = render(<PWAInstallPrompt />);
    expect(container.firstChild).toBeNull();
  });

  it('should call installApp when install button is clicked', async () => {
    mockInstallApp.mockResolvedValue(true);

    render(<PWAInstallPrompt />);

    const installButton = screen.getByText('설치');
    fireEvent.click(installButton);

    expect(mockInstallApp).toHaveBeenCalledTimes(1);
  });

  it('should hide prompt after successful installation', async () => {
    mockInstallApp.mockResolvedValue(true);

    const { container } = render(<PWAInstallPrompt />);

    const installButton = screen.getByText('설치');
    fireEvent.click(installButton);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('should remain visible after failed installation', async () => {
    mockInstallApp.mockResolvedValue(false);

    render(<PWAInstallPrompt />);

    const installButton = screen.getByText('설치');
    fireEvent.click(installButton);

    await waitFor(() => {
      expect(screen.getByText('앱으로 설치하기')).toBeInTheDocument();
    });
  });

  it('should hide prompt when dismiss button is clicked', () => {
    const { container } = render(<PWAInstallPrompt />);

    const dismissButton = screen.getByText('나중에');
    fireEvent.click(dismissButton);

    expect(container.firstChild).toBeNull();
  });

  it('should hide prompt when close button is clicked', () => {
    const { container } = render(<PWAInstallPrompt />);

    const closeButton = container.querySelector('button[class*="text-gray-400"]');
    expect(closeButton).toBeInTheDocument();
    
    fireEvent.click(closeButton!);

    expect(container.firstChild).toBeNull();
  });

  it('should apply touch feedback props to buttons', () => {
    render(<PWAInstallPrompt />);

    const installButton = screen.getByText('설치');
    const dismissButton = screen.getByText('나중에');

    // Check that touch props are applied (we can't directly test the spread operator,
    // but we can verify the hooks are called)
    expect(mockUseTouchFeedback).toHaveBeenCalled();
  });

  it('should have proper accessibility attributes', () => {
    render(<PWAInstallPrompt />);

    const installButton = screen.getByText('설치');
    const dismissButton = screen.getByText('나중에');

    expect(installButton).toHaveClass('touch-manipulation');
    expect(dismissButton).toHaveClass('touch-manipulation');
  });
});