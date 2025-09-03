import { z } from 'zod';

// Time validation helper
const timeSchema = z.object({
  hours: z.number().min(0, "시간은 0 이상이어야 합니다").max(23, "시간은 23 이하여야 합니다"),
  minutes: z.number().min(0, "분은 0 이상이어야 합니다").max(59, "분은 59 이하여야 합니다"),
  seconds: z.number().min(0, "초는 0 이상이어야 합니다").max(59, "초는 59 이하여야 합니다")
}).refine(
  (time) => time.hours > 0 || time.minutes > 0 || time.seconds > 0,
  { message: "목표 시간을 입력해주세요", path: ["hours"] }
);

// Marathon distance enum with Korean labels
export const MARATHON_DISTANCES = {
  '5km': '5km',
  '10km': '10km',
  'Half': '하프 마라톤 (21.1km)',
  'Full': '풀 마라톤 (42.2km)'
} as const;

export const marathonInfoSchema = z.object({
  raceName: z.string()
    .min(1, "대회 이름을 입력해주세요")
    .max(100, "대회 이름은 100자 이하여야 합니다")
    .trim(),
  raceDate: z.date().refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    },
    "대회 날짜는 오늘 이후여야 합니다"
  ),
  distance: z.enum(['5km', '10km', 'Half', 'Full'], {
    message: "거리를 선택해주세요"
  }),
  targetTime: timeSchema
}).refine(
  (data) => {
    // Validate reasonable target times based on distance
    const { distance, targetTime } = data;
    const totalMinutes = targetTime.hours * 60 + targetTime.minutes + targetTime.seconds / 60;
    
    const minTimes = {
      '5km': 10, // 10 minutes minimum
      '10km': 20, // 20 minutes minimum
      'Half': 60, // 1 hour minimum
      'Full': 120 // 2 hours minimum
    };
    
    const maxTimes = {
      '5km': 120, // 2 hours maximum
      '10km': 240, // 4 hours maximum
      'Half': 480, // 8 hours maximum
      'Full': 720 // 12 hours maximum
    };
    
    return totalMinutes >= minTimes[distance] && totalMinutes <= maxTimes[distance];
  },
  {
    message: "선택한 거리에 대해 현실적인 목표 시간을 입력해주세요",
    path: ["targetTime"]
  }
);

export const runningRecordSchema = z.object({
  recordDate: z.date().refine(
    (date) => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const today = new Date();
      return date >= sixMonthsAgo && date <= today;
    },
    "기록 날짜는 최근 6개월 이내여야 합니다"
  ),
  distance: z.number()
    .positive("거리는 양수여야 합니다")
    .min(0.1, "최소 0.1km 이상 입력해주세요")
    .max(50, "최대 50km까지 입력 가능합니다"),
  time: timeSchema
}).refine(
  (data) => {
    // Validate reasonable pace (not too fast or too slow)
    const { distance, time } = data;
    const totalMinutes = time.hours * 60 + time.minutes + time.seconds / 60;
    const pacePerKm = totalMinutes / distance;
    
    // Reasonable pace range: 2-20 minutes per km
    return pacePerKm >= 2 && pacePerKm <= 20;
  },
  {
    message: "거리와 시간이 현실적이지 않습니다. 다시 확인해주세요",
    path: ["time"]
  }
);

// Form data schema for complete form validation
export const formDataSchema = z.object({
  marathonInfo: marathonInfoSchema,
  runningHistory: z.array(runningRecordSchema).optional(),
  hasRunningHistory: z.boolean()
});

// Export types (inferred from schemas)
export type MarathonInfo = z.infer<typeof marathonInfoSchema>;
export type RunningRecord = z.infer<typeof runningRecordSchema>;
export type FormData = z.infer<typeof formDataSchema>;

// Validation helper functions
export function validateMarathonInfo(data: unknown) {
  return marathonInfoSchema.safeParse(data);
}

export function validateRunningRecord(data: unknown) {
  return runningRecordSchema.safeParse(data);
}

export function validateFormData(data: unknown) {
  return formDataSchema.safeParse(data);
}