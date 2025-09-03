'use client';

import { useState } from 'react';
import { MarathonInfo, marathonInfoSchema } from '@/lib/validations';
import { TextInput, DatePicker, DistanceSelector, TimeInput } from '@/components/ui';
import { NavigationButtons } from '@/components/ui';

interface MarathonInfoFormProps {
  initialData?: Partial<MarathonInfo>;
  onSubmit: (data: MarathonInfo) => void;
  onBack?: () => void;
}

export default function MarathonInfoForm({
  initialData = {},
  onSubmit,
  onBack
}: MarathonInfoFormProps) {
  const [formData, setFormData] = useState<Partial<MarathonInfo>>({
    raceName: initialData.raceName || '',
    raceDate: initialData.raceDate || undefined,
    distance: initialData.distance || undefined,
    targetTime: initialData.targetTime || { hours: 0, minutes: 0, seconds: 0 }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: keyof MarathonInfo, value: unknown) => {
    try {
      const fieldSchema = marathonInfoSchema.shape[field];
      fieldSchema.parse(value);
      setErrors(prev => ({ ...prev, [field]: '' }));
      return true;
    } catch (error) {
      const errorMessage = (error as { errors?: { message: string }[] })?.errors?.[0]?.message || '유효하지 않은 값입니다';
      setErrors(prev => ({ ...prev, [field]: errorMessage }));
      return false;
    }
  };

  const handleFieldChange = (field: keyof MarathonInfo, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    if (value !== null && value !== '' && value !== undefined) {
      if (field === 'targetTime') {
        const timeValue = value as { hours: number; minutes: number; seconds: number };
        if (timeValue.hours > 0 || timeValue.minutes > 0 || timeValue.seconds > 0) {
          validateField(field, value);
        } else {
          setErrors(prev => ({ ...prev, [field]: '' }));
        }
      } else {
        validateField(field, value);
      }
    } else {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    try {
      marathonInfoSchema.parse(formData);
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

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (validateForm()) {
        onSubmit(formData as MarathonInfo);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.raceName && 
           formData.raceDate && 
           formData.distance && 
           formData.targetTime &&
           (formData.targetTime.hours > 0 || formData.targetTime.minutes > 0 || formData.targetTime.seconds > 0) &&
           Object.values(errors).every(error => !error);
  };

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">마라톤 정보 입력</h1>
        <p className="text-gray-600">참가할 마라톤 대회 정보를 입력해주세요</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Race Name */}
        <TextInput
          label="대회명"
          value={formData.raceName || ''}
          onChange={(e) => handleFieldChange('raceName', e.target.value)}
          placeholder="예: 서울국제마라톤"
          error={errors.raceName}
          required
        />

        {/* Race Date */}
        <DatePicker
          label="대회 날짜"
          value={formData.raceDate || null}
          onChange={(date) => handleFieldChange('raceDate', date)}
          error={errors.raceDate}
          minDate={new Date()}
          placeholder="대회 날짜를 선택하세요"
        />

        {/* Distance */}
        <DistanceSelector
          label="참가 거리"
          value={formData.distance || null}
          onChange={(distance) => handleFieldChange('distance', distance)}
          error={errors.distance}
          placeholder="참가할 거리를 선택하세요"
        />

        {/* Target Time */}
        <TimeInput
          label="목표 시간"
          value={formData.targetTime || { hours: 0, minutes: 0, seconds: 0 }}
          onChange={(time) => handleFieldChange('targetTime', time)}
          error={errors.targetTime}
        />

        {/* Helper Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">입력 가이드</p>
              <ul className="space-y-1 text-blue-700">
                <li>• 대회 날짜는 오늘 이후 날짜만 선택 가능합니다</li>
                <li>• 목표 시간은 현실적인 목표로 설정해주세요</li>
                <li>• 모든 정보는 나중에 수정할 수 있습니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <NavigationButtons
        onNext={handleSubmit}
        onBack={onBack}
        nextLabel="다음 단계"
        backLabel="이전"
        nextDisabled={!isFormValid() || isSubmitting}
        showBack={!!onBack}
        loading={isSubmitting}
      />
    </div>
  );
}