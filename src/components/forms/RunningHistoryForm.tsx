'use client';

import { useState } from 'react';
import { RunningRecord, runningRecordSchema } from '@/lib/validations';
import { DatePicker, NumberInput, TimeInput } from '@/components/ui';
import { NavigationButtons } from '@/components/ui';

interface RunningHistoryFormProps {
  initialData?: RunningRecord[];
  onSubmit: (data: RunningRecord[]) => void;
  onBack?: () => void;
}

export default function RunningHistoryForm({
  initialData = [],
  onSubmit,
  onBack
}: RunningHistoryFormProps) {
  const [hasHistory, setHasHistory] = useState<boolean | null>(null);
  const [records, setRecords] = useState<RunningRecord[]>(initialData);
  const [currentRecord, setCurrentRecord] = useState<Partial<RunningRecord>>({
    recordDate: undefined,
    distance: 0,
    time: { hours: 0, minutes: 0, seconds: 0 }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateRecord = (record: Partial<RunningRecord>): boolean => {
    try {
      runningRecordSchema.parse(record);
      setErrors({});
      return true;
    } catch (error) {
      const newErrors: Record<string, string> = {};
      const zodError = error as { errors?: { path: string[]; message: string }[] };
      zodError.errors?.forEach((err) => {
        const field = err.path[0];
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleAddRecord = () => {
    if (validateRecord(currentRecord)) {
      setRecords([...records, currentRecord as RunningRecord]);
      setCurrentRecord({
        recordDate: undefined,
        distance: 0,
        time: { hours: 0, minutes: 0, seconds: 0 }
      });
      setErrors({});
    }
  };

  const handleRemoveRecord = (index: number) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (hasHistory === false) {
        onSubmit([]);
      } else if (hasHistory === true) {
        onSubmit(records);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    if (hasHistory === null) return false;
    if (hasHistory === false) return true;
    return records.length > 0;
  };

  const canAddRecord = () => {
    return currentRecord.recordDate && 
           currentRecord.distance && 
           currentRecord.distance > 0 &&
           currentRecord.time &&
           (currentRecord.time.hours > 0 || currentRecord.time.minutes > 0 || currentRecord.time.seconds > 0) &&
           Object.keys(errors).length === 0 &&
           records.length < 3; // 최대 3개 제한
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR');
  };

  const formatTime = (time: { hours: number; minutes: number; seconds: number }) => {
    const h = time.hours.toString().padStart(2, '0');
    const m = time.minutes.toString().padStart(2, '0');
    const s = time.seconds.toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (hasHistory === null) {
    return (
      <div className="space-y-6">
        {/* Form Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">러닝 기록</h1>
          <p className="text-gray-600">최근 6개월 내 러닝 기록이 있으신가요?</p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">🏃‍♂️</div>
            <h2 className="text-xl font-semibold text-gray-900">러닝 기록을 알려주세요</h2>
            <p className="text-gray-600">
              최근 6개월 내 러닝 기록이 있다면 더 정확한 훈련 계획을 만들어드릴 수 있어요.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setHasHistory(true)}
              className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">네, 있어요</div>
                  <div className="text-sm text-gray-600">러닝 기록을 입력하겠습니다</div>
                </div>
                <div className="text-blue-600">→</div>
              </div>
            </button>

            <button
              onClick={() => setHasHistory(false)}
              className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">아니요, 없어요</div>
                  <div className="text-sm text-gray-600">기본 계획으로 시작하겠습니다</div>
                </div>
                <div className="text-blue-600">→</div>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <NavigationButtons
          onNext={() => {}} // 비활성화
          onBack={onBack}
          nextLabel="다음 단계"
          backLabel="이전"
          nextDisabled={true}
          showBack={!!onBack}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">러닝 기록 입력</h1>
        <p className="text-gray-600">
          {hasHistory ? '최근 6개월 내 러닝 기록을 입력해주세요' : '기본 계획으로 훈련 계획을 생성합니다'}
        </p>
      </div>

      {hasHistory && (
        <>
          {/* Add Record Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">새 기록 추가</h2>

            <div className="space-y-4">
              {/* Record Date */}
              <DatePicker
                label="러닝 날짜"
                value={currentRecord.recordDate || null}
                onChange={(date) => setCurrentRecord(prev => ({ ...prev, recordDate: date || undefined }))}
                error={errors.recordDate}
                maxDate={new Date()}
                minDate={(() => {
                  const sixMonthsAgo = new Date();
                  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                  return sixMonthsAgo;
                })()}
              />

              {/* Distance */}
              <NumberInput
                label="거리"
                value={currentRecord.distance || 0}
                onChange={(distance) => setCurrentRecord(prev => ({ ...prev, distance }))}
                error={errors.distance}
                unit="km"
                min={0.1}
                max={50}
                step={0.1}
                placeholder="러닝한 거리를 입력하세요"
              />

              {/* Time */}
              <TimeInput
                label="소요 시간"
                value={currentRecord.time || { hours: 0, minutes: 0, seconds: 0 }}
                onChange={(time) => setCurrentRecord(prev => ({ ...prev, time }))}
                error={errors.time}
              />

              <button
                onClick={handleAddRecord}
                disabled={!canAddRecord()}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
              >
                {records.length >= 3 ? '최대 3개까지 입력 가능' : '기록 추가'}
              </button>
            </div>
          </div>

          {/* Records List */}
          {records.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">입력된 기록 ({records.length}개)</h2>
              
              <div className="space-y-3">
                {records.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {formatDate(record.recordDate)} - {record.distance}km
                      </div>
                      <div className="text-sm text-gray-600">
                        소요시간: {formatTime(record.time)} 
                        <span className="ml-2">
                          (평균 페이스: {Math.round((record.time.hours * 60 + record.time.minutes + record.time.seconds / 60) / record.distance * 10) / 10}분/km)
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveRecord(index)}
                      className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Helper Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">
              {hasHistory ? '러닝 기록 입력 가이드' : '기본 계획 안내'}
            </p>
            {hasHistory ? (
              <ul className="space-y-1 text-blue-700">
                <li>• 최근 6개월 내 기록만 입력 가능합니다</li>
                <li>• 최대 3개까지 기록을 입력할 수 있습니다</li>
                <li>• 여러 개의 기록을 입력할수록 더 정확한 계획을 받을 수 있어요</li>
                <li>• 기록이 없어도 훈련 계획을 만들 수 있습니다</li>
              </ul>
            ) : (
              <p className="text-blue-700">
                러닝 기록이 없어도 목표 시간을 바탕으로 적절한 훈련 계획을 만들어드립니다.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <NavigationButtons
        onNext={handleSubmit}
        onBack={() => setHasHistory(null)}
        nextLabel="훈련 계획 생성"
        backLabel="이전"
        nextDisabled={!isFormValid() || isSubmitting}
        showBack={true}
        loading={isSubmitting}
      />
    </div>
  );
}