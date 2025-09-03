'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TimeInputProps {
  value: { hours: number; minutes: number; seconds: number };
  onChange: (time: { hours: number; minutes: number; seconds: number }) => void;
  label?: string;
  error?: string;
  placeholder?: { hours?: string; minutes?: string; seconds?: string };
  disabled?: boolean;
  className?: string;
}

export default function TimeInput({
  value,
  onChange,
  label,
  error,
  placeholder = { hours: '시', minutes: '분', seconds: '초' },
  disabled = false,
  className = ''
}: TimeInputProps) {
  const [localValue, setLocalValue] = useState({
    hours: value.hours.toString(),
    minutes: value.minutes.toString(),
    seconds: value.seconds.toString()
  });

  useEffect(() => {
    setLocalValue({
      hours: value.hours.toString(),
      minutes: value.minutes.toString(),
      seconds: value.seconds.toString()
    });
  }, [value]);

  const handleChange = (field: 'hours' | 'minutes' | 'seconds', inputValue: string) => {
    // Allow empty string or valid numbers
    if (inputValue === '' || /^\d+$/.test(inputValue)) {
      const newLocalValue = { ...localValue, [field]: inputValue };
      setLocalValue(newLocalValue);

      // Convert to numbers and validate ranges
      const hours = Math.max(0, Math.min(23, parseInt(newLocalValue.hours) || 0));
      const minutes = Math.max(0, Math.min(59, parseInt(newLocalValue.minutes) || 0));
      const seconds = Math.max(0, Math.min(59, parseInt(newLocalValue.seconds) || 0));

      onChange({ hours, minutes, seconds });
    }
  };

  const handleBlur = (field: 'hours' | 'minutes' | 'seconds') => {
    // Format the value on blur
    const numValue = parseInt(localValue[field]) || 0;
    const maxValue = field === 'hours' ? 23 : 59;
    const clampedValue = Math.max(0, Math.min(maxValue, numValue));
    
    setLocalValue(prev => ({
      ...prev,
      [field]: clampedValue.toString()
    }));
  };

  const inputBaseClasses = "w-16 h-12 text-center text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
  const inputErrorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";
  const inputDisabledClasses = disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white";

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="flex items-center justify-center space-x-2">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <input
            type="text"
            inputMode="numeric"
            value={localValue.hours}
            onChange={(e) => handleChange('hours', e.target.value)}
            onBlur={() => handleBlur('hours')}
            placeholder={placeholder.hours}
            disabled={disabled}
            className={cn(inputBaseClasses, inputErrorClasses, inputDisabledClasses)}
            maxLength={2}
          />
          <span className="text-xs text-gray-500 mt-1">시간</span>
        </div>

        <span className="text-xl font-bold text-gray-400 pb-6">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <input
            type="text"
            inputMode="numeric"
            value={localValue.minutes}
            onChange={(e) => handleChange('minutes', e.target.value)}
            onBlur={() => handleBlur('minutes')}
            placeholder={placeholder.minutes}
            disabled={disabled}
            className={cn(inputBaseClasses, inputErrorClasses, inputDisabledClasses)}
            maxLength={2}
          />
          <span className="text-xs text-gray-500 mt-1">분</span>
        </div>

        <span className="text-xl font-bold text-gray-400 pb-6">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <input
            type="text"
            inputMode="numeric"
            value={localValue.seconds}
            onChange={(e) => handleChange('seconds', e.target.value)}
            onBlur={() => handleBlur('seconds')}
            placeholder={placeholder.seconds}
            disabled={disabled}
            className={cn(inputBaseClasses, inputErrorClasses, inputDisabledClasses)}
            maxLength={2}
          />
          <span className="text-xs text-gray-500 mt-1">초</span>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}