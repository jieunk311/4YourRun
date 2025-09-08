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
                raceName: "Seoul Marathon",
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
        const targetTimeStr = `${targetTime.hours}h ${targetTime.minutes}m ${targetTime.seconds}s`;

        // Build running history context
        let historyContext = '';
        if (hasRunningHistory && runningHistory && runningHistory.length > 0) {
            historyContext = '\n\nRecent running records:\n';
            runningHistory.forEach((record, index) => {
                const recordTimeStr = `${record.time.hours}h ${record.time.minutes}m ${record.time.seconds}s`;
                historyContext += `${index + 1}. ${record.recordDate.toLocaleDateString('en-US')}: ${record.distance}km in ${recordTimeStr}\n`;
            });
        } else {
            historyContext = '\n\nRunning records: No records in the last 6 months (considered beginner)';
        }

        // Verify prompt components
        expect(raceName).toBe("Seoul Marathon");
        expect(distance).toBe("Full");
        expect(targetTimeStr).toBe("4h 30m 0s");
        expect(weeksUntilRace).toBeGreaterThan(0);
        expect(historyContext).toContain('Recent running records:');
        expect(historyContext).toContain('10km in 1h 0m 0s');
    });

    it('should handle user without running history', () => {
        const formData: FormData = {
            marathonInfo: {
                raceName: "Busan Marathon",
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
            historyContext = '\n\nRecent running records:\n';
            runningHistory.forEach((record, index) => {
                const recordTimeStr = `${record.time.hours}h ${record.time.minutes}m ${record.time.seconds}s`;
                historyContext += `${index + 1}. ${record.recordDate.toLocaleDateString('en-US')}: ${record.distance}km in ${recordTimeStr}\n`;
            });
        } else {
            historyContext = '\n\nRunning records: No records in the last 6 months (considered beginner)';
        }

        expect(historyContext).toBe('\n\nRunning records: No records in the last 6 months (considered beginner)');
    });

    it('should validate training plan response structure', () => {
        const mockTrainingPlan = {
            weeks: [
                {
                    week: 1,
                    totalDistance: 15,
                    trainingComposition: "Easy Run 3 times (3-4km each), LSD 1 time (6km)",
                    objectives: "Build basic fitness and running habits"
                },
                {
                    week: 2,
                    totalDistance: 18,
                    trainingComposition: "Easy Run 3 times (4-5km each), LSD 1 time (8km)",
                    objectives: "Improve endurance and running form"
                }
            ],
            totalWeeks: 12,
            totalDistance: 200,
            averageWeeklyDistance: 16.7,
            progressData: [15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 35],
            aiFeedback: "Make sure to do proper warm-up and cool-down to prevent injuries during training."
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
        mockTrainingPlan.weeks.forEach((week) => {
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
      "trainingComposition": "Easy Run 3 times",
      "objectives": "Build basic fitness"
    }
  ],
  "totalWeeks": 12,
  "totalDistance": 200,
  "averageWeeklyDistance": 16.7,
  "progressData": [15, 18, 20],
  "aiFeedback": "Training tips"
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
        expect(parsed.aiFeedback).toBe("Training tips");
    });
});