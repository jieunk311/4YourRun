import { generateTrainingPlan, ApiError, NetworkError } from '../api';
import { FormData } from '../validations';

// Mock fetch globally
global.fetch = jest.fn();

const mockFormData: FormData = {
  marathonInfo: {
    raceName: "서울 마라톤",
    raceDate: new Date('2024-12-01'),
    distance: "Full",
    targetTime: {
      hours: 4,
      minutes: 30,
      seconds: 0
    }
  },
  runningHistory: [
    {
      recordDate: new Date('2024-01-15'),
      distance: 10,
      time: {
        hours: 1,
        minutes: 0,
        seconds: 0
      }
    }
  ],
  hasRunningHistory: true
};

const mockTrainingPlan = {
  weeks: [
    {
      week: 1,
      totalDistance: 15,
      trainingComposition: "Easy Run 3회 (각 3-4km), LSD 1회 (6km)",
      objectives: "기초 체력 향상 및 러닝 습관 형성"
    }
  ],
  totalWeeks: 12,
  totalDistance: 200,
  averageWeeklyDistance: 16.7,
  progressData: [15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 35],
  aiFeedback: "훈련 중 부상 예방을 위해 충분한 워밍업과 쿨다운을 실시하세요."
};

describe('generateTrainingPlan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully generate training plan', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        trainingPlan: mockTrainingPlan
      })
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await generateTrainingPlan(mockFormData);

    expect(global.fetch).toHaveBeenCalledWith('/api/generate-plan', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockFormData),
    }));

    expect(result).toEqual(mockTrainingPlan);
  });

  it('should handle API error response', async () => {
    const mockErrorResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        error: '입력 데이터가 유효하지 않습니다',
        details: ['Invalid race date']
      })
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockErrorResponse);

    await expect(generateTrainingPlan(mockFormData)).rejects.toThrow(ApiError);
    
    try {
      await generateTrainingPlan(mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).message).toBe('입력 데이터가 유효하지 않습니다');
      expect((error as ApiError).status).toBe(400);
      expect((error as ApiError).details).toEqual(['Invalid race date']);
    }
  });

  it('should handle server error without specific message', async () => {
    const mockErrorResponse = {
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({})
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockErrorResponse);

    await expect(generateTrainingPlan(mockFormData)).rejects.toThrow(ApiError);
  }, 10000);

  it('should handle network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(
      new TypeError('Failed to fetch')
    );

    await expect(generateTrainingPlan(mockFormData)).rejects.toThrow(NetworkError);
  }, 10000);

  it('should handle unexpected errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(
      new Error('Unexpected error')
    );

    await expect(generateTrainingPlan(mockFormData)).rejects.toThrow(ApiError);
  }, 10000);

  it('should handle malformed JSON response', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockRejectedValue(new SyntaxError('Unexpected token'))
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(generateTrainingPlan(mockFormData)).rejects.toThrow(ApiError);
  }, 10000);

  it('should send correct request format', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        trainingPlan: mockTrainingPlan
      })
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await generateTrainingPlan(mockFormData);

    expect(global.fetch).toHaveBeenCalledWith('/api/generate-plan', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockFormData),
    }));
  });
});

describe('ApiError', () => {
  it('should create ApiError with message only', () => {
    const error = new ApiError('Test error');
    
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('ApiError');
    expect(error.status).toBeUndefined();
    expect(error.details).toBeUndefined();
  });

  it('should create ApiError with status and details', () => {
    const details = { field: 'validation error' };
    const error = new ApiError('Test error', 400, details);
    
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('ApiError');
    expect(error.status).toBe(400);
    expect(error.details).toBe(details);
  });
});