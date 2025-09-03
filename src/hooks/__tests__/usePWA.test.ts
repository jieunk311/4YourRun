import { renderHook, act } from '@testing-library/react';
import { usePWA } from '../usePWA';

// Mock window.matchMedia
const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia,
  writable: true
});

// Mock navigator.standalone for iOS
Object.defineProperty(window.navigator, 'standalone', {
  value: false,
  writable: true
});

describe('usePWA', () => {
  let mockAddEventListener: jest.SpyInstance;
  let mockRemoveEventListener: jest.SpyInstance;

  beforeEach(() => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });

    mockAddEventListener = jest.spyOn(window, 'addEventListener');
    mockRemoveEventListener = jest.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    mockAddEventListener.mockRestore();
    mockRemoveEventListener.mockRestore();
    mockMatchMedia.mockClear();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => usePWA());

    expect(result.current.isInstallable).toBe(false);
    expect(result.current.isInstalled).toBe(false);
  });

  it('should detect installed PWA via display-mode', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });

    const { result } = renderHook(() => usePWA());

    expect(result.current.isInstalled).toBe(true);
  });

  it('should detect installed PWA via iOS standalone', () => {
    (window.navigator as any).standalone = true;

    const { result } = renderHook(() => usePWA());

    expect(result.current.isInstalled).toBe(true);

    // Reset
    (window.navigator as any).standalone = false;
  });

  it('should handle beforeinstallprompt event', () => {
    const { result } = renderHook(() => usePWA());

    // Simulate beforeinstallprompt event
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };

    act(() => {
      const handler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'beforeinstallprompt'
      )?.[1];
      
      if (handler) {
        handler(mockEvent);
      }
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(result.current.isInstallable).toBe(true);
  });

  it('should handle app installation', async () => {
    const { result } = renderHook(() => usePWA());

    // Set up installable state
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };

    act(() => {
      const handler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'beforeinstallprompt'
      )?.[1];
      
      if (handler) {
        handler(mockEvent);
      }
    });

    // Install the app
    let installResult: boolean | undefined;
    await act(async () => {
      installResult = await result.current.installApp();
    });

    expect(mockEvent.prompt).toHaveBeenCalled();
    expect(installResult).toBe(true);
    expect(result.current.isInstallable).toBe(false);
  });

  it('should handle installation rejection', async () => {
    const { result } = renderHook(() => usePWA());

    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'dismissed' })
    };

    act(() => {
      const handler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'beforeinstallprompt'
      )?.[1];
      
      if (handler) {
        handler(mockEvent);
      }
    });

    let installResult: boolean | undefined;
    await act(async () => {
      installResult = await result.current.installApp();
    });

    expect(installResult).toBe(false);
  });

  it('should handle appinstalled event', () => {
    const { result } = renderHook(() => usePWA());

    act(() => {
      const handler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'appinstalled'
      )?.[1];
      
      if (handler) {
        handler(new Event('appinstalled'));
      }
    });

    expect(result.current.isInstalled).toBe(true);
    expect(result.current.isInstallable).toBe(false);
  });

  it('should return false when trying to install without prompt', async () => {
    const { result } = renderHook(() => usePWA());

    const installResult = await result.current.installApp();

    expect(installResult).toBe(false);
  });

  it('should clean up event listeners on unmount', () => {
    const { unmount } = renderHook(() => usePWA());

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'beforeinstallprompt',
      expect.any(Function)
    );
    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'appinstalled',
      expect.any(Function)
    );
  });
});