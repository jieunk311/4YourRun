'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MARATHON_DISTANCES } from '@/lib/validations';

type DistanceOption = keyof typeof MARATHON_DISTANCES;

interface DistanceSelectorProps {
  value: DistanceOption | null;
  onChange: (distance: DistanceOption) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function DistanceSelector({
  value,
  onChange,
  label,
  error,
  placeholder = '거리를 선택하세요',
  disabled = false,
  className = ''
}: DistanceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonId = `distance-selector-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (distance: DistanceOption) => {
    onChange(distance);
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const buttonClasses = cn(
    "w-full h-12 px-4 text-left text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex items-center justify-between",
    error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "",
    disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white cursor-pointer hover:bg-gray-50"
  );

  const dropdownClasses = cn(
    "absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto",
    isOpen ? "block" : "hidden"
  );

  return (
    <div className={cn("space-y-2", className)} ref={containerRef}>
      {label && (
        <label htmlFor={buttonId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          id={buttonId}
          type="button"
          onClick={handleButtonClick}
          disabled={disabled}
          className={buttonClasses}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value ? MARATHON_DISTANCES[value] : placeholder}
          </span>
          
          {/* Chevron icon */}
          <svg
            className={cn(
              "w-5 h-5 text-gray-400 transition-transform",
              isOpen ? "transform rotate-180" : ""
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div className={dropdownClasses} role="listbox">
          {Object.entries(MARATHON_DISTANCES).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key as DistanceOption)}
              className={cn(
                "w-full px-4 py-3 text-left text-base hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors",
                value === key ? "bg-blue-100 text-blue-900 font-medium" : "text-gray-900"
              )}
              role="option"
              aria-selected={value === key}
            >
              <div className="flex flex-col">
                <span className="font-medium">{key}</span>
                <span className="text-sm text-gray-600">{label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}