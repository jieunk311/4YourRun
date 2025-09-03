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

  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts) {
        throw new RetryError(
          `작업이 ${maxAttempts}번 시도 후 실패했습니다`,
          attempt,
          error
        );
      }
      
      // Don't retry on certain errors
      if (shouldNotRetry(error)) {
        throw error;
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

function shouldNotRetry(error: { status?: number }): boolean {
  // Don't retry on validation errors (400)
  if (error.status === 400) {
    return true;
  }
  
  // Don't retry on authentication errors (401, 403)
  if (error.status === 401 || error.status === 403) {
    return true;
  }
  
  // Don't retry on not found errors (404)
  if (error.status === 404) {
    return true;
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