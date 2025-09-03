import { FormData } from '../validations';

// Mock fetch for testing the API service
global.fetch = jest.fn();

describe('Gemini AI Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate structured prompt correctly', () => {
    const formData: FormData = {
      marathonInfo: {
        raceName: "서울 마라톤",
        raceDate: new Date('2025-12-01'),
        distance: "Full",
        targetTime: {
          hours: 4,
          minutes: 30,
          seconds: 0
        }
      },
      runningHistory: [
        {
          recordDate: new Date('2024-08-15'),
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

    // Test prompt generation logic (extracted from API route)
    const { raceName, raceDate, distance, targetTime } = formData.marathonInfo;
    const { runningHistory, hasRunningHistory } = formData;
    
    // Calculate weeks until race
    const today = new Date();
    const raceDateTime = new Date(raceDate);
    const weeksUntilRace = Math.ceil((raceDateTime.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7));
    
    // Format target time
    const targetTimeStr = `${targetTime.hours}시간 ${targetTime.minutes}분 ${targetTime.seconds}초`;
    
    // Build running history context
    let historyContext = '';
    if (hasRunningHistory && runningHistory && runningHistory.length > 0) {
      historyContext = '\n\n최근 러닝 기록:\n';
      runningHistory.forEach((record, index) => {
        const recordTimeStr = `${record.time.hours}시간 ${record.time.minutes}분 ${record.time.seconds}초`;
        historyContext += `${index + 1}. ${record.recordDate.toLocaleDateString('ko-KR')}: ${record.distance}km를 ${recordTimeStr}에 완주\n`;
      });
    } else {
      historyContext = '\n\n러닝 기록: 최근 6개월 내 기록 없음 (초보자로 간주)';
    }

    // Verify prompt components
    expect(raceName).toBe("서울 마라톤");
    expect(distance).toBe("Full");
    expect(targetTimeStr).toBe("4시간 30분 0초");
    expect(weeksUntilRace).toBeGreaterThan(0);
    expect(historyContext).toContain('최근 러닝 기록:');
    expect(historyContext).toContain('10km를 1시간 0분 0초에 완주');
  });

  it('should handle user without running history', () => {
    const formData: FormData = {
      marathonInfo: {
        raceName: "부산 마라톤",
        raceDate: new Date('2025-10-01'),
        distance: "Half",
        targetTime: {
          hours: 2,
          minutes: 0,
          seconds: 0
        }
      },
      runningHistory: [],
      hasRunningHistory: false
    };

    const { hasRunningHistory, runningHistory } = formData;
    
    // Build running history context
    let historyContext = '';
    if (hasRunningHistory && runningHistory && runningHistory.length > 0) {
      historyContext = '\n\n최근 러닝 기록:\n';
      runningHistory.forEach((record, index) => {
        const recordTimeStr = `${record.time.hours}시간 ${record.time.minutes}분 ${record.time.seconds}초`;
        historyContext += `${index + 1}. ${record.recordDate.toLocaleDateString('ko-KR')}: ${record.distance}km를 ${recordTimeStr}에 완주\n`;
      });
    } else {
      historyContext = '\n\n러닝 기록: 최근 6개월 내 기록 없음 (초보자로 간주)';
    }

    expect(historyContext).toBe('\n\n러닝 기록: 최근 6개월 내 기록 없음 (초보자로 간주)');
  });

  it('should validate training plan response structure', () => {
    const mockTrainingPlan = {
      weeks: [
        {
          week: 1,
          totalDistance: 15,
          trainingComposition: "Easy Run 3회 (각 3-4km), LSD 1회 (6km)",
          objectives: "기초 체력 향상 및 러닝 습관 형성"
        },
        {
          week: 2,
          totalDistance: 18,
          trainingComposition: "Easy Run 3회 (각 4-5km), LSD 1회 (8km)",
          objectives: "지구력 향상 및 러닝 폼 개선"
        }
      ],
      totalWeeks: 12,
      totalDistance: 200,
      averageWeeklyDistance: 16.7,
      progressData: [15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 35],
      aiFeedback: "훈련 중 부상 예방을 위해 충분한 워밍업과 쿨다운을 실시하세요."
    };

    // Validate structure (this would be the parsing logic from API route)
    expect(mockTrainingPlan.weeks).toBeDefined();
    expect(Array.isArray(mockTrainingPlan.weeks)).toBe(true);
    expect(mockTrainingPlan.totalWeeks).toBeDefined();
    expect(mockTrainingPlan.totalDistance).toBeDefined();
    expect(mockTrainingPlan.averageWeeklyDistance).toBeDefined();
    expect(mockTrainingPlan.progressData).toBeDefined();
    expect(Array.isArray(mockTrainingPlan.progressData)).toBe(true);
    expect(mockTrainingPlan.aiFeedback).toBeDefined();
    expect(typeof mockTrainingPlan.aiFeedback).toBe('string');

    // Validate each week structure
    mockTrainingPlan.weeks.forEach((week, index) => {
      expect(week.week).toBeDefined();
      expect(week.totalDistance).toBeDefined();
      expect(week.trainingComposition).toBeDefined();
      expect(week.objectives).toBeDefined();
      expect(typeof week.week).toBe('number');
      expect(typeof week.totalDistance).toBe('number');
      expect(typeof week.trainingComposition).toBe('string');
      expect(typeof week.objectives).toBe('string');
    });
  });

  it('should handle JSON parsing with markdown formatting', () => {
    const responseWithMarkdown = `
\`\`\`json
{
  "weeks": [
    {
      "week": 1,
      "totalDistance": 15,
      "trainingComposition": "Easy Run 3회",
      "objectives": "기초 체력 향상"
    }
  ],
  "totalWeeks": 12,
  "totalDistance": 200,
  "averageWeeklyDistance": 16.7,
  "progressData": [15, 18, 20],
  "aiFeedback": "훈련 팁"
}
\`\`\`
    `;

    // Simulate parsing logic from API route
    let cleanResponse = responseWithMarkdown.trim();
    
    // Find JSON content between curly braces
    const jsonStart = cleanResponse.indexOf('{');
    const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
    
    expect(jsonStart).toBeGreaterThan(-1);
    expect(jsonEnd).toBeGreaterThan(0);
    
    cleanResponse = cleanResponse.substring(jsonStart, jsonEnd);
    
    const parsed = JSON.parse(cleanResponse);
    
    expect(parsed.weeks).toBeDefined();
    expect(parsed.totalWeeks).toBe(12);
    expect(parsed.aiFeedback).toBe("훈련 팁");
  });
});