/**
 * @jest-environment node
 */

// Mock environment variable
process.env.GOOGLE_GEMINI_API_KEY = 'test-api-key';

// Mock the Google Generative AI
const mockGenerateContent = jest.fn();
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: mockGenerateContent
    }))
  }))
}));

import { POST } from '../route';
import { NextRequest } from 'next/server';

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

describe('API Route /api/generate-plan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate training plan successfully', async () => {
    // Mock successful AI response
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify(mockTrainingPlan)
      }
    });

    // Create valid form data
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);
    
    const recentDate = new Date();
    recentDate.setMonth(recentDate.getMonth() - 2);

    const validFormData = {
      marathonInfo: {
        raceName: "서울 마라톤",
        raceDate: futureDate.toISOString(),
        distance: "Full",
        targetTime: {
          hours: 4,
          minutes: 30,
          seconds: 0
        }
      },
      runningHistory: [
        {
          recordDate: recentDate.toISOString(),
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

    const request = new NextRequest('http://localhost:3000/api/generate-plan', {
      method: 'POST',
      body: JSON.stringify(validFormData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.trainingPlan).toEqual(mockTrainingPlan);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  it('should handle validation errors', async () => {
    const invalidData = {
      marathonInfo: {
        raceName: "", // Invalid: empty name
        raceDate: "2020-01-01", // Invalid: past date
        distance: "Invalid",
        targetTime: {
          hours: -1, // Invalid: negative hours
          minutes: 0,
          seconds: 0
        }
      },
      runningHistory: [],
      hasRunningHistory: false
    };

    const request = new NextRequest('http://localhost:3000/api/generate-plan', {
      method: 'POST',
      body: JSON.stringify(invalidData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('입력 데이터가 유효하지 않습니다');
    expect(data.details).toBeDefined();
  });

  it('should handle AI API errors', async () => {
    // Mock AI API failure
    mockGenerateContent.mockRejectedValue(new Error('API quota exceeded'));

    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);

    const validFormData = {
      marathonInfo: {
        raceName: "서울 마라톤",
        raceDate: futureDate.toISOString(),
        distance: "Full",
        targetTime: {
          hours: 4,
          minutes: 30,
          seconds: 0
        }
      },
      runningHistory: [],
      hasRunningHistory: false
    };

    const request = new NextRequest('http://localhost:3000/api/generate-plan', {
      method: 'POST',
      body: JSON.stringify(validFormData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('API quota exceeded');
  });

  it('should handle invalid AI response format', async () => {
    // Mock invalid AI response
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => 'Invalid JSON response'
      }
    });

    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);

    const validFormData = {
      marathonInfo: {
        raceName: "서울 마라톤",
        raceDate: futureDate.toISOString(),
        distance: "Full",
        targetTime: {
          hours: 4,
          minutes: 30,
          seconds: 0
        }
      },
      runningHistory: [],
      hasRunningHistory: false
    };

    const request = new NextRequest('http://localhost:3000/api/generate-plan', {
      method: 'POST',
      body: JSON.stringify(validFormData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('AI 응답을 파싱하는데 실패했습니다');
  });
});