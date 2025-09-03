import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { formDataSchema, MarathonInfo, RunningRecord } from '@/lib/validations';
import { TrainingPlan } from '@/types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

function generatePrompt(marathonInfo: MarathonInfo, runningHistory: RunningRecord[], hasRunningHistory: boolean): string {
  const { raceName, raceDate, distance, targetTime } = marathonInfo;
  
  // Calculate weeks until race
  const today = new Date();
  const raceDateTime = new Date(raceDate);
  const weeksUntilRace = Math.ceil((raceDateTime.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7));
  
  // Format target time
  const targetTimeStr = `${targetTime.hours}시간 ${targetTime.minutes}분 ${targetTime.seconds}초`;
  
  // Build running history context
  let historyContext = '';
  if (hasRunningHistory && runningHistory.length > 0) {
    historyContext = '\n\n최근 러닝 기록:\n';
    runningHistory.forEach((record, index) => {
      const recordTimeStr = `${record.time.hours}시간 ${record.time.minutes}분 ${record.time.seconds}초`;
      historyContext += `${index + 1}. ${record.recordDate.toLocaleDateString('ko-KR')}: ${record.distance}km를 ${recordTimeStr}에 완주\n`;
    });
  } else {
    historyContext = '\n\n러닝 기록: 최근 6개월 내 기록 없음 (초보자로 간주)';
  }

  return `당신은 전문 마라톤 코치입니다. 다음 정보를 바탕으로 개인 맞춤형 마라톤 훈련 계획을 작성해주세요.

목표 대회 정보:
- 대회명: ${raceName}
- 대회 날짜: ${raceDateTime.toLocaleDateString('ko-KR')}
- 거리: ${distance}
- 목표 시간: ${targetTimeStr}
- 훈련 가능 기간: ${weeksUntilRace}주

${historyContext}

다음 JSON 형식으로 정확히 응답해주세요:

{
  "weeks": [
    {
      "week": 1,
      "totalDistance": 15,
      "trainingComposition": "Easy Run 3회 (각 3-4km), LSD 1회 (6km)",
      "objectives": "기초 체력 향상 및 러닝 습관 형성"
    }
  ],
  "totalWeeks": ${weeksUntilRace},
  "totalDistance": 200,
  "averageWeeklyDistance": 15,
  "progressData": [10, 12, 15, 18, 20],
  "aiFeedback": "훈련 중 주의사항과 팁을 한국어로 제공"
}

요구사항:
1. 각 주차별로 구체적인 훈련 구성을 제시하세요
2. 점진적으로 거리를 늘려가는 계획을 세우세요
3. Easy Run, LSD(Long Slow Distance), Tempo Run, Interval 등 다양한 훈련 방법을 포함하세요
4. 목표 시간 달성을 위한 현실적인 계획을 세우세요
5. 부상 예방을 위한 휴식일도 고려하세요
6. progressData는 주차별 총 거리 배열로 제공하세요
7. aiFeedback에는 훈련 중 주의사항, 페이스 관리법, 부상 예방법 등을 포함하세요

JSON 형식만 응답하고 다른 텍스트는 포함하지 마세요.`;
}

function parseAIResponse(response: string): TrainingPlan {
  try {
    // Clean the response - remove any markdown formatting or extra text
    let cleanResponse = response.trim();
    
    // Find JSON content between curly braces
    const jsonStart = cleanResponse.indexOf('{');
    const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No JSON found in response');
    }
    
    cleanResponse = cleanResponse.substring(jsonStart, jsonEnd);
    
    const parsed = JSON.parse(cleanResponse);
    
    // Validate the structure
    if (!parsed.weeks || !Array.isArray(parsed.weeks)) {
      throw new Error('Invalid weeks data');
    }
    
    if (!parsed.totalWeeks || !parsed.totalDistance || !parsed.averageWeeklyDistance) {
      throw new Error('Missing required summary data');
    }
    
    if (!parsed.progressData || !Array.isArray(parsed.progressData)) {
      throw new Error('Invalid progress data');
    }
    
    if (!parsed.aiFeedback || typeof parsed.aiFeedback !== 'string') {
      throw new Error('Missing AI feedback');
    }
    
    // Validate each week structure
    parsed.weeks.forEach((week: any, index: number) => {
      if (!week.week || !week.totalDistance || !week.trainingComposition || !week.objectives) {
        throw new Error(`Invalid week ${index + 1} structure`);
      }
    });
    
    return parsed as TrainingPlan;
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error('AI 응답을 파싱하는데 실패했습니다');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Parse dates from strings if needed
    if (body.marathonInfo?.raceDate && typeof body.marathonInfo.raceDate === 'string') {
      body.marathonInfo.raceDate = new Date(body.marathonInfo.raceDate);
    }
    
    if (body.runningHistory && Array.isArray(body.runningHistory)) {
      body.runningHistory.forEach((record: any) => {
        if (record.recordDate && typeof record.recordDate === 'string') {
          record.recordDate = new Date(record.recordDate);
        }
      });
    }
    
    // Validate input data
    const validation = formDataSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: '입력 데이터가 유효하지 않습니다', details: validation.error.issues },
        { status: 400 }
      );
    }
    
    const { marathonInfo, runningHistory = [], hasRunningHistory } = validation.data;
    
    // Generate prompt
    const prompt = generatePrompt(marathonInfo, runningHistory, hasRunningHistory);
    
    // Call Gemini AI: gemini-2.5-flash-lite 모델을 사용할 것
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' }); 
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });
    
    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('AI로부터 응답을 받지 못했습니다');
    }
    
    // Parse AI response
    const trainingPlan = parseAIResponse(text);
    
    return NextResponse.json({ trainingPlan });
    
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: '훈련 계획 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}