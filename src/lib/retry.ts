export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

export class RetryError extends Error {
  constructor(
    message: string,
    public attempts: number,
    public lastError: Error
  ) {
    super(message);
    this.name = 'RetryError';
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    onRetry
  } = options;

  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (caughtError) {
      const error = caughtError instanceof Error ? caughtError : new Error(String(caughtError));
      lastError = error;
      
      if (attempt === maxAttempts) {
        throw new RetryError(
          `작업이 ${maxAttempts}번 시도 후 실패했습니다`,
          attempt,
          error
        );
      }
      
      // Don't retry on certain errors
      if (shouldNotRetry(caughtError)) {
        throw caughtError;
      }
      
      if (onRetry) {
        onRetry(attempt, error);
      }
      
      // Calculate delay with optional backoff
      const currentDelay = backoff ? delay * Math.pow(2, attempt - 1) : delay;
      await sleep(currentDelay);
    }
  }
  
  throw lastError;
}

function shouldNotRetry(error: unknown): boolean {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status: unknown }).status;
    if (typeof status === 'number') {
      // Don't retry on validation errors (400)
      if (status === 400) {
        return true;
      }
      
      // Don't retry on authentication errors (401, 403)
      if (status === 401 || status === 403) {
        return true;
      }
      
      // Don't retry on not found errors (404)
      if (status === 404) {
        return true;
      }
    }
  }
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Hook for using retry with React state
export function useRetry() {
  const retry = async <T>(
    fn: () => Promise<T>,
    options?: RetryOptions
  ): Promise<T> => {
    return withRetry(fn, options);
  };
  
  return { retry };
}