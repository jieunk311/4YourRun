import { withRetry, RetryError, useRetry } from '../retry';
import { renderHook } from '@testing-library/react';

describe('withRetry', () => {

  it('succeeds on first attempt', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');

    const result = await withRetry(mockFn);

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and eventually succeeds', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValue('success');

    const result = await withRetry(mockFn, { maxAttempts: 3, delay: 1 });

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('throws RetryError after max attempts', async () => {
    const mockError = new Error('Persistent failure');
    const mockFn = jest.fn().mockRejectedValue(mockError);

    await expect(withRetry(mockFn, { maxAttempts: 2, delay: 1 })).rejects.toThrow(RetryError);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('uses exponential backoff when enabled', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('Failure'));
    const mockOnRetry = jest.fn();

    await expect(withRetry(mockFn, {
      maxAttempts: 3,
      delay: 1,
      backoff: true,
      onRetry: mockOnRetry
    })).rejects.toThrow(RetryError);

    expect(mockOnRetry).toHaveBeenCalledTimes(2);
  });

  it('does not use backoff when disabled', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('Failure'));
    const mockOnRetry = jest.fn();

    await expect(withRetry(mockFn, {
      maxAttempts: 3,
      delay: 1,
      backoff: false,
      onRetry: mockOnRetry
    })).rejects.toThrow(RetryError);

    expect(mockOnRetry).toHaveBeenCalledTimes(2);
  });

  it('does not retry on 400 status error', async () => {
    const mockError = { status: 400, message: 'Bad Request' };
    const mockFn = jest.fn().mockRejectedValue(mockError);

    await expect(withRetry(mockFn, { maxAttempts: 3 })).rejects.toEqual(mockError);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('does not retry on 401 status error', async () => {
    const mockError = { status: 401, message: 'Unauthorized' };
    const mockFn = jest.fn().mockRejectedValue(mockError);

    await expect(withRetry(mockFn, { maxAttempts: 3 })).rejects.toEqual(mockError);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('does not retry on 403 status error', async () => {
    const mockError = { status: 403, message: 'Forbidden' };
    const mockFn = jest.fn().mockRejectedValue(mockError);

    await expect(withRetry(mockFn, { maxAttempts: 3 })).rejects.toEqual(mockError);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('does not retry on 404 status error', async () => {
    const mockError = { status: 404, message: 'Not Found' };
    const mockFn = jest.fn().mockRejectedValue(mockError);

    await expect(withRetry(mockFn, { maxAttempts: 3 })).rejects.toEqual(mockError);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('retries on 500 status error', async () => {
    const mockError = { status: 500, message: 'Internal Server Error' };
    const mockFn = jest.fn().mockRejectedValue(mockError);

    await expect(withRetry(mockFn, { maxAttempts: 2, delay: 1 })).rejects.toThrow(RetryError);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('calls onRetry callback on each retry', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('Failure'));
    const mockOnRetry = jest.fn();

    await expect(withRetry(mockFn, {
      maxAttempts: 3,
      delay: 1,
      onRetry: mockOnRetry
    })).rejects.toThrow(RetryError);

    expect(mockOnRetry).toHaveBeenCalledTimes(2);
    expect(mockOnRetry).toHaveBeenNthCalledWith(1, 1, expect.any(Error));
    expect(mockOnRetry).toHaveBeenNthCalledWith(2, 2, expect.any(Error));
  });
});

describe('useRetry', () => {
  it('returns retry function', () => {
    const { result } = renderHook(() => useRetry());

    expect(typeof result.current.retry).toBe('function');
  });

  it('retry function works correctly', async () => {
    const { result } = renderHook(() => useRetry());
    const mockFn = jest.fn().mockResolvedValue('success');

    const response = await result.current.retry(mockFn);

    expect(response).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe('RetryError', () => {
  it('creates error with correct properties', () => {
    const lastError = new Error('Original error');
    const retryError = new RetryError('Retry failed', 3, lastError);

    expect(retryError.message).toBe('Retry failed');
    expect(retryError.attempts).toBe(3);
    expect(retryError.lastError).toBe(lastError);
    expect(retryError.name).toBe('RetryError');
  });
});