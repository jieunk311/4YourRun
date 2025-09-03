'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export default function NumberInput({
  value,
  onChange,
  label,
  error,
  helperText,
  placeholder,
  disabled = false,
  className = '',
  min,
  max,
  step = 0.1,
  unit
}: NumberInputProps) {
  const [localValue, setLocalValue] = useState(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string, numbers, and decimal points
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      setLocalValue(inputValue);
      
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        // Apply min/max constraints
        let clampedValue = numValue;
        if (min !== undefined) clampedValue = Math.max(min, clampedValue);
        if (max !== undefined) clampedValue = Math.min(max, clampedValue);
        
        onChange(clampedValue);
      } else if (inputValue === '') {
        onChange(0);
      }
    }
  };

  const handleBlur = () => {
    // Format the value on blur
    const numValue = parseFloat(localValue) || 0;
    let clampedValue = numValue;
    
    if (min !== undefined) clampedValue = Math.max(min, clampedValue);
    if (max !== undefined) clampedValue = Math.min(max, clampedValue);
    
    setLocalValue(clampedValue.toString());
    onChange(clampedValue);
  };

  const inputClasses = cn(
    "w-full h-12 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
    error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "",
    disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white",
    unit ? "pr-12" : "",
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          min={min}
          max={max}
          step={step}
        />
        
        {unit && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base pointer-events-none">
            {unit}
          </div>
        )}
      </div>
      
      {helperText && !error && (
        <p className="text-sm text-gray-600">{helperText}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}