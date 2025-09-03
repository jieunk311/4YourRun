import {
  marathonInfoSchema,
  runningRecordSchema,
  formDataSchema,
  validateMarathonInfo,
  validateRunningRecord,
  MARATHON_DISTANCES
} from '../validations';

describe('marathonInfoSchema', () => {
  const validMarathonInfo = {
    raceName: '서울 마라톤',
    raceDate: new Date('2025-12-01'),
    distance: '10km' as const,
    targetTime: { hours: 0, minutes: 45, seconds: 0 }
  };

  it('validates correct marathon info', () => {
    const result = marathonInfoSchema.safeParse(validMarathonInfo);
    expect(result.success).toBe(true);
  });

  it('rejects empty race name', () => {
    const result = marathonInfoSchema.safeParse({
      ...validMarathonInfo,
      raceName: ''
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('대회 이름을 입력해주세요');
    }
  });

  it('rejects past race date', () => {
    const result = marathonInfoSchema.safeParse({
      ...validMarathonInfo,
      raceDate: new Date('2020-01-01')
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('대회 날짜는 오늘 이후여야 합니다');
    }
  });

  it('rejects invalid distance', () => {
    const result = marathonInfoSchema.safeParse({
      ...validMarathonInfo,
      distance: 'invalid'
    });
    expect(result.success).toBe(false);
  });

  it('rejects zero target time', () => {
    const result = marathonInfoSchema.safeParse({
      ...validMarathonInfo,
      targetTime: { hours: 0, minutes: 0, seconds: 0 }
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('목표 시간을 입력해주세요');
    }
  });

  it('rejects unrealistic target time for 5km', () => {
    const result = marathonInfoSchema.safeParse({
      ...validMarathonInfo,
      distance: '5km',
      targetTime: { hours: 0, minutes: 5, seconds: 0 } // Too fast
    });
    expect(result.success).toBe(false);
  });

  it('rejects unrealistic target time for Full marathon', () => {
    const result = marathonInfoSchema.safeParse({
      ...validMarathonInfo,
      distance: 'Full',
      targetTime: { hours: 1, minutes: 0, seconds: 0 } // Too fast
    });
    expect(result.success).toBe(false);
  });
});

describe('runningRecordSchema', () => {
  const validRunningRecord = {
    recordDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    distance: 10,
    time: { hours: 0, minutes: 50, seconds: 0 }
  };

  it('validates correct running record', () => {
    const result = runningRecordSchema.safeParse(validRunningRecord);
    expect(result.success).toBe(true);
  });

  it('rejects date older than 6 months', () => {
    const oldDate = new Date();
    oldDate.setMonth(oldDate.getMonth() - 7);
    
    const result = runningRecordSchema.safeParse({
      ...validRunningRecord,
      recordDate: oldDate
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('기록 날짜는 최근 6개월 이내여야 합니다');
    }
  });

  it('rejects negative distance', () => {
    const result = runningRecordSchema.safeParse({
      ...validRunningRecord,
      distance: -5
    });
    expect(result.success).toBe(false);
  });

  it('rejects unrealistic pace (too fast)', () => {
    const result = runningRecordSchema.safeParse({
      ...validRunningRecord,
      distance: 10,
      time: { hours: 0, minutes: 10, seconds: 0 } // 1 min/km - too fast
    });
    expect(result.success).toBe(false);
  });

  it('rejects unrealistic pace (too slow)', () => {
    const result = runningRecordSchema.safeParse({
      ...validRunningRecord,
      distance: 1,
      time: { hours: 1, minutes: 0, seconds: 0 } // 60 min/km - too slow
    });
    expect(result.success).toBe(false);
  });
});

describe('formDataSchema', () => {
  const validFormData = {
    marathonInfo: {
      raceName: '서울 마라톤',
      raceDate: new Date('2025-12-01'),
      distance: '10km' as const,
      targetTime: { hours: 0, minutes: 45, seconds: 0 }
    },
    runningHistory: [{
      recordDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      distance: 10,
      time: { hours: 0, minutes: 50, seconds: 0 }
    }],
    hasRunningHistory: true
  };

  it('validates complete form data', () => {
    const result = formDataSchema.safeParse(validFormData);
    expect(result.success).toBe(true);
  });

  it('validates form data without running history', () => {
    const result = formDataSchema.safeParse({
      marathonInfo: validFormData.marathonInfo,
      hasRunningHistory: false
    });
    expect(result.success).toBe(true);
  });
});

describe('validation helper functions', () => {
  it('validateMarathonInfo returns success for valid data', () => {
    const result = validateMarathonInfo({
      raceName: '서울 마라톤',
      raceDate: new Date('2025-12-01'),
      distance: '10km',
      targetTime: { hours: 0, minutes: 45, seconds: 0 }
    });
    expect(result.success).toBe(true);
  });

  it('validateRunningRecord returns error for invalid data', () => {
    const result = validateRunningRecord({
      recordDate: new Date('2020-01-01'),
      distance: -5,
      time: { hours: 0, minutes: 0, seconds: 0 }
    });
    expect(result.success).toBe(false);
  });
});

describe('MARATHON_DISTANCES', () => {
  it('contains all expected distances', () => {
    expect(MARATHON_DISTANCES['5km']).toBe('5km');
    expect(MARATHON_DISTANCES['10km']).toBe('10km');
    expect(MARATHON_DISTANCES['Half']).toBe('하프 마라톤 (21.1km)');
    expect(MARATHON_DISTANCES['Full']).toBe('풀 마라톤 (42.2km)');
  });
});