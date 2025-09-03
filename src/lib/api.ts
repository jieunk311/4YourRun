import { FormData } from '@/lib/validations';
import { withRetry, RetryError } from '@/lib/retry';

interface TrainingWeek {
  week: number;
  totalDistance: number;
  trainingComposition: string;
  objectives: string;
}

interface TrainingPlan {
  weeks: TrainingWeek[];
  totalWeeks: number;
  totalDistance: number;
  averageWeeklyDistance: number;
  progressData: number[];
  aiFeedback: string;
}

interface GeneratePlanResponse {
  trainingPlan: TrainingPlan;
}

interface ApiErrorResponse {
  error: string;
  details?: unknown;
}

export class ApiError extends Error {
  constructor(message: string, public status?: number, public details?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = '네트워크 연결을 확인해주세요') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = '요청 시간이 초과되었습니다') {
    super(message);
    this.name = 'TimeoutError';
  }
}

async function fetchWithTimeout(
  url: string, 
  options: RequestInit, 
  timeout: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError();
    }
    
    throw error;
  }
}

async function makeApiRequest(formData: FormData): Promise<TrainingPlan> {
  try {
    const response = await fetchWithTimeout('/api/generate-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ApiErrorResponse;
      throw new ApiError(
        errorData.error || '훈련 계획 생성에 실패했습니다',
        response.status,
        errorData.details
      );
    }

    const result = data as GeneratePlanResponse;
    return result.trainingPlan;
  } catch (error) {
    if (error instanceof ApiError || error instanceof TimeoutError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError();
    }

    // Handle other errors
    throw new ApiError('훈련 계획 생성 중 예상치 못한 오류가 발생했습니다');
  }
}

export async function generateTrainingPlan(
  formData: FormData,
  onRetry?: (attempt: number, error: Error) => void
): Promise<TrainingPlan> {
  try {
    return await withRetry(
      () => makeApiRequest(formData),
      {
        maxAttempts: 3,
        delay: 2000,
        backoff: true,
        onRetry
      }
    );
  } catch (error) {
    if (error instanceof RetryError) {
      // Convert retry error to appropriate error type
      const lastError = error.lastError;
      
      if (lastError instanceof NetworkError) {
        throw new NetworkError('네트워크 연결 문제로 요청에 실패했습니다. 인터넷 연결을 확인해주세요.');
      }
      
      if (lastError instanceof TimeoutError) {
        throw new TimeoutError('서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
      }
      
      if (lastError instanceof ApiError) {
        throw new ApiError(
          'AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
          lastError.status,
          lastError.details
        );
      }
    }
    
    throw error;
  }
}

// Export types for use in components
export type { TrainingPlan, TrainingWeek };