import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RunningHistoryForm from '../RunningHistoryForm';
import { RunningRecord } from '../../../lib/validations';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { describe } from 'node:test';
import { it } from 'zod/locales';
import { describe } from 'node:test';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { describe } from 'node:test';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { describe } from 'node:test';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { describe } from 'node:test';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { describe } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';
import { expect } from '@playwright/test';

// Mock the individual UI components
jest.mock('../../ui/DatePicker', () => {
  return function MockDatePicker({ label, value, onChange, error, maxDate, minDate }: any) {
    return (
      <div>
        <label>{label}</label>
        <input
          type="date"
          value={value ? value.toISOString().split('T')[0] : ''}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
          data-testid="date-picker"
        />
        {error && <span data-testid="date-error">{error}</span>}
      </div>
    );
  };
});

jest.mock('../../ui/NumberInput', () => {
  return function MockNumberInput({ label, value, onChange, error, unit, min, max, step, placeholder }: any) {
    return (
      <div>
        <label>{label}</label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          data-testid="number-input"
        />
        {unit && <span>{unit}</span>}
        {error && <span data-testid="number-error">{error}</span>}
      </div>
    );
  };
});

jest.mock('../../ui/TimeInput', () => {
  return function MockTimeInput({ label, value, onChange, error }: any) {
    return (
      <div>
        <label>{label}</label>
        <input
          type="number"
          value={value.hours}
          onChange={(e) => onChange({ ...value, hours: parseInt(e.target.value) || 0 })}
          data-testid="time-hours"
          placeholder="시간"
        />
        <input
          type="number"
          value={value.minutes}
          onChange={(e) => onChange({ ...value, minutes: parseInt(e.target.value) || 0 })}
          data-testid="time-minutes"
          placeholder="분"
        />
        <input
          type="number"
          value={value.seconds}
          onChange={(e) => onChange({ ...value, seconds: parseInt(e.target.value) || 0 })}
          data-testid="time-seconds"
          placeholder="초"
        />
        {error && <span data-testid="time-error">{error}</span>}
      </div>
    );
  };
});

jest.mock('../../ui/NavigationButtons', () => {
  return function MockNavigationButtons({ onNext, onBack, nextLabel, backLabel, nextDisabled, showBack, loading }: any) {
    const handleNext = () => {
      if (!nextDisabled && !loading) {
        onNext();
      }
    };
    
    return (
      <div>
        {showBack && (
          <button onClick={onBack} data-testid="back-button">
            {backLabel}
          </button>
        )}
        <button 
          onClick={handleNext} 
          disabled={nextDisabled || loading}
          data-testid="next-button"
        >
          {loading ? '처리중...' : nextLabel}
        </button>
      </div>
    );
  };
});

describe('RunningHistoryForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnBack = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onBack: mockOnBack
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Question Display', () => {
    it('renders initial question asking about running history', () => {
      render(<RunningHistoryForm {...defaultProps} />);
      
      expect(screen.getByText('러닝 기록')).toBeInTheDocument();
      expect(screen.getByText('최근 6개월 내 러닝 기록이 있으신가요?')).toBeInTheDocument();
      expect(screen.getByText('러닝 기록을 알려주세요')).toBeInTheDocument();
    });

    it('shows both yes and no options', () => {
      render(<RunningHistoryForm {...defaultProps} />);
      
      expect(screen.getByText('네, 있어요')).toBeInTheDocument();
      expect(screen.getByText('아니요, 없어요')).toBeInTheDocument();
    });

    it('disables next button initially', () => {
      render(<RunningHistoryForm {...defaultProps} />);
      
      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).toBeDisabled();
    });

    it('shows back button when onBack is provided', () => {
      render(<RunningHistoryForm {...defaultProps} />);
      
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });

    it('does not show back button when onBack is not provided', () => {
      render(<RunningHistoryForm onSubmit={mockOnSubmit} />);
      
      expect(screen.queryByTestId('back-button')).not.toBeInTheDocument();
    });
  });

  describe('Conditional Form Display - No History', () => {
    it('shows appropriate message when user selects no history', async () => {
      const user = userEvent.setup();
      render(<RunningHistoryForm {...defaultProps} />);
      
      const noButton = screen.getByText('아니요, 없어요');
      await user.click(noButton);
      
      expect(screen.getByText('기본 계획으로 훈련 계획을 생성합니다')).toBeInTheDocument();
      expect(screen.getByText('기본 계획 안내')).toBeInTheDocument();
    });

    it('enables next button when no history is selected', async () => {
      const user = userEvent.setup();
      render(<RunningHistoryForm {...defaultProps} />);
      
      const noButton = screen.getByText('아니요, 없어요');
      await user.click(noButton);
      
      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).not.toBeDisabled();
    });

    it('calls onSubmit with empty array when no history is submitted', async () => {
      const user = userEvent.setup();
      render(<RunningHistoryForm {...defaultProps} />);
      
      const noButton = screen.getByText('아니요, 없어요');
      await user.click(noButton);
      
      const nextButton = screen.getByTestId('next-button');
      await user.click(nextButton);
      
      expect(mockOnSubmit).toHaveBeenCalledWith([]);
    });
  });

  describe('Conditional Form Display - With History', () => {
    it('shows record input form when user selects yes', async () => {
      const user = userEvent.setup();
      render(<RunningHistoryForm {...defaultProps} />);
      
      const yesButton = screen.getByText('네, 있어요');
      await user.click(yesButton);
      
      expect(screen.getByText('러닝 기록 입력')).toBeInTheDocument();
      expect(screen.getByText('최근 6개월 내 러닝 기록을 입력해주세요')).toBeInTheDocument();
      expect(screen.getByText('새 기록 추가')).toBeInTheDocument();
    });

    it('shows all required input fields', async () => {
      const user = userEvent.setup();
      render(<RunningHistoryForm {...defaultProps} />);
      
      const yesButton = screen.getByText('네, 있어요');
      await user.click(yesButton);
      
      expect(screen.getByText('러닝 날짜')).toBeInTheDocument();
      expect(screen.getByText('거리')).toBeInTheDocument();
      expect(screen.getByText('소요 시간')).toBeInTheDocument();
      expect(screen.getByTestId('date-picker')).toBeInTheDocument();
      expect(screen.getByTestId('number-input')).toBeInTheDocument();
      expect(screen.getByTestId('time-hours')).toBeInTheDocument();
    });

    it('shows helper text for record input', async () => {
      const user = userEvent.setup();
      render(<RunningHistoryForm {...defaultProps} />);
      
      const yesButton = screen.getByText('네, 있어요');
      await user.click(yesButton);
      
      expect(screen.getByText('러닝 기록 입력 가이드')).toBeInTheDocument();
      expect(screen.getByText('• 최근 6개월 내 기록만 입력 가능합니다')).toBeInTheDocument();
    });
  });

  describe('Multiple Running Record Entry', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<RunningHistoryForm {...defaultProps} />);
      
      const yesButton = screen.getByText('네, 있어요');
      await user.click(yesButton);
    });

    it('allows adding a valid running record', async () => {
      const user = userEvent.setup();
      
      // Fill in valid record data
      const dateInput = screen.getByTestId('date-picker');
      const distanceInput = screen.getByTestId('number-input');
      const hoursInput = screen.getByTestId('time-hours');
      const minutesInput = screen.getByTestId('time-minutes');
      
      const validDate = new Date();
      validDate.setMonth(validDate.getMonth() - 1); // 1 month ago
      
      await user.type(dateInput, validDate.toISOString().split('T')[0]);
      await user.clear(distanceInput);
      await user.type(distanceInput, '5');
      await user.clear(hoursInput);
      await user.type(hoursInput, '0');
      await user.clear(minutesInput);
      await user.type(minutesInput, '30');
      
      const addButton = screen.getByText('기록 추가');
      await user.click(addButton);
      
      expect(screen.getByText('입력된 기록 (1개)')).toBeInTheDocument();
    });

    it('displays added records with correct information', async () => {
      const user = userEvent.setup();
      
      // Add a record
      const dateInput = screen.getByTestId('date-picker');
      const distanceInput = screen.getByTestId('number-input');
      const minutesInput = screen.getByTestId('time-minutes');
      
      const validDate = new Date();
      validDate.setMonth(validDate.getMonth() - 1);
      
      await user.type(dateInput, validDate.toISOString().split('T')[0]);
      await user.clear(distanceInput);
      await user.type(distanceInput, '10');
      await user.clear(minutesInput);
      await user.type(minutesInput, '50');
      
      const addButton = screen.getByText('기록 추가');
      await user.click(addButton);
      
      expect(screen.getByText(/10km/)).toBeInTheDocument();
      expect(screen.getByText(/소요시간: 00:50:00/)).toBeInTheDocument();
      expect(screen.getByText(/평균 페이스:/)).toBeInTheDocument();
    });

    it('allows removing added records', async () => {
      const user = userEvent.setup();
      
      // Add a record first
      const dateInput = screen.getByTestId('date-picker');
      const distanceInput = screen.getByTestId('number-input');
      const minutesInput = screen.getByTestId('time-minutes');
      
      const validDate = new Date();
      validDate.setMonth(validDate.getMonth() - 1);
      
      await user.type(dateInput, validDate.toISOString().split('T')[0]);
      await user.clear(distanceInput);
      await user.type(distanceInput, '5');
      await user.clear(minutesInput);
      await user.type(minutesInput, '25');
      
      const addButton = screen.getByText('기록 추가');
      await user.click(addButton);
      
      expect(screen.getByText('입력된 기록 (1개)')).toBeInTheDocument();
      
      // Remove the record
      const deleteButton = screen.getByText('삭제');
      await user.click(deleteButton);
      
      expect(screen.queryByText('입력된 기록')).not.toBeInTheDocument();
    });

    it('clears form after adding a record', async () => {
      const user = userEvent.setup();
      
      // Fill and add a record
      const dateInput = screen.getByTestId('date-picker');
      const distanceInput = screen.getByTestId('number-input');
      const minutesInput = screen.getByTestId('time-minutes');
      
      const validDate = new Date();
      validDate.setMonth(validDate.getMonth() - 1);
      
      await user.type(dateInput, validDate.toISOString().split('T')[0]);
      await user.clear(distanceInput);
      await user.type(distanceInput, '5');
      await user.clear(minutesInput);
      await user.type(minutesInput, '25');
      
      const addButton = screen.getByText('기록 추가');
      await user.click(addButton);
      
      // Check that form is cleared
      expect(screen.getByTestId('date-picker')).toHaveValue('');
      expect(screen.getByTestId('number-input')).toHaveValue(0);
    });

    it('limits records to maximum of 3', async () => {
      const user = userEvent.setup();
      
      // Add 3 records
      for (let i = 0; i < 3; i++) {
        const dateInput = screen.getByTestId('date-picker');
        const distanceInput = screen.getByTestId('number-input');
        const minutesInput = screen.getByTestId('time-minutes');
        
        const validDate = new Date();
        validDate.setMonth(validDate.getMonth() - 1);
        validDate.setDate(validDate.getDate() - i); // Different dates
        
        await user.clear(dateInput);
        await user.type(dateInput, validDate.toISOString().split('T')[0]);
        await user.clear(distanceInput);
        await user.type(distanceInput, `${5 + i}`);
        await user.clear(minutesInput);
        await user.type(minutesInput, `${25 + i * 5}`);
        
        const addButton = screen.getByText(i < 2 ? '기록 추가' : '기록 추가');
        await user.click(addButton);
      }
      
      expect(screen.getByText('입력된 기록 (3개)')).toBeInTheDocument();
      
      // Try to add 4th record - button should be disabled and show different text
      const addButton = screen.getByText('최대 3개까지 입력 가능');
      expect(addButton).toBeDisabled();
    });
  });

  describe('Form Validation', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<RunningHistoryForm {...defaultProps} />);
      
      const yesButton = screen.getByText('네, 있어요');
      await user.click(yesButton);
    });

    it('disables add button when form is incomplete', () => {
      const addButton = screen.getByText('기록 추가');
      expect(addButton).toBeDisabled();
    });

    it('enables add button when all fields are valid', async () => {
      const user = userEvent.setup();
      
      const dateInput = screen.getByTestId('date-picker');
      const distanceInput = screen.getByTestId('number-input');
      const minutesInput = screen.getByTestId('time-minutes');
      
      const validDate = new Date();
      validDate.setMonth(validDate.getMonth() - 1);
      
      await user.type(dateInput, validDate.toISOString().split('T')[0]);
      await user.clear(distanceInput);
      await user.type(distanceInput, '5');
      await user.clear(minutesInput);
      await user.type(minutesInput, '25');
      
      const addButton = screen.getByText('기록 추가');
      expect(addButton).not.toBeDisabled();
    });

    it('disables next button when no records are added', async () => {
      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).toBeDisabled();
    });

    it('enables next button when at least one record is added', async () => {
      const user = userEvent.setup();
      
      // Add a valid record
      const dateInput = screen.getByTestId('date-picker');
      const distanceInput = screen.getByTestId('number-input');
      const minutesInput = screen.getByTestId('time-minutes');
      
      const validDate = new Date();
      validDate.setMonth(validDate.getMonth() - 1);
      
      await user.type(dateInput, validDate.toISOString().split('T')[0]);
      await user.clear(distanceInput);
      await user.type(distanceInput, '5');
      await user.clear(minutesInput);
      await user.type(minutesInput, '25');
      
      const addButton = screen.getByText('기록 추가');
      await user.click(addButton);
      
      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Navigation and Submission', () => {
    it('calls onBack when back button is clicked from initial question', async () => {
      const user = userEvent.setup();
      render(<RunningHistoryForm {...defaultProps} />);
      
      const backButton = screen.getByTestId('back-button');
      await user.click(backButton);
      
      expect(mockOnBack).toHaveBeenCalled();
    });

    it('returns to initial question when back is clicked from record form', async () => {
      const user = userEvent.setup();
      render(<RunningHistoryForm {...defaultProps} />);
      
      // Go to record form
      const yesButton = screen.getByText('네, 있어요');
      await user.click(yesButton);
      
      expect(screen.getByText('러닝 기록 입력')).toBeInTheDocument();
      
      // Click back
      const backButton = screen.getByTestId('back-button');
      await user.click(backButton);
      
      // Should return to initial question
      expect(screen.getByText('최근 6개월 내 러닝 기록이 있으신가요?')).toBeInTheDocument();
    });

    it('calls onSubmit with records when form is submitted', async () => {
      const user = userEvent.setup();
      render(<RunningHistoryForm {...defaultProps} />);
      
      // Go to record form
      const yesButton = screen.getByText('네, 있어요');
      await user.click(yesButton);
      
      // Add a record
      const dateInput = screen.getByTestId('date-picker');
      const distanceInput = screen.getByTestId('number-input');
      const minutesInput = screen.getByTestId('time-minutes');
      
      const validDate = new Date();
      validDate.setMonth(validDate.getMonth() - 1);
      
      await user.type(dateInput, validDate.toISOString().split('T')[0]);
      await user.clear(distanceInput);
      await user.type(distanceInput, '5');
      await user.clear(minutesInput);
      await user.type(minutesInput, '25');
      
      const addButton = screen.getByText('기록 추가');
      await user.click(addButton);
      
      // Submit form
      const nextButton = screen.getByTestId('next-button');
      await user.click(nextButton);
      
      expect(mockOnSubmit).toHaveBeenCalledWith([
        expect.objectContaining({
          distance: 5,
          time: expect.objectContaining({
            hours: 0,
            minutes: 25,
            seconds: 0
          })
        })
      ]);
    });


  });

  describe('Initial Data Handling', () => {
    it('renders with initial data when provided', () => {
      const initialData: RunningRecord[] = [
        {
          recordDate: new Date('2024-01-15'),
          distance: 10,
          time: { hours: 1, minutes: 0, seconds: 0 }
        }
      ];
      
      render(<RunningHistoryForm {...defaultProps} initialData={initialData} />);
      
      // Should start with the initial question, not show records immediately
      expect(screen.getByText('최근 6개월 내 러닝 기록이 있으신가요?')).toBeInTheDocument();
    });
  });

  describe('Accessibility and User Experience', () => {
    it('shows appropriate Korean labels and messages', () => {
      render(<RunningHistoryForm {...defaultProps} />);
      
      expect(screen.getByText('러닝 기록')).toBeInTheDocument();
      expect(screen.getByText('네, 있어요')).toBeInTheDocument();
      expect(screen.getByText('아니요, 없어요')).toBeInTheDocument();
    });

    it('provides helpful guidance text', async () => {
      const user = userEvent.setup();
      render(<RunningHistoryForm {...defaultProps} />);
      
      const yesButton = screen.getByText('네, 있어요');
      await user.click(yesButton);
      
      expect(screen.getByText('• 최근 6개월 내 기록만 입력 가능합니다')).toBeInTheDocument();
      expect(screen.getByText('• 최대 3개까지 기록을 입력할 수 있습니다')).toBeInTheDocument();
      expect(screen.getByText('• 여러 개의 기록을 입력할수록 더 정확한 계획을 받을 수 있어요')).toBeInTheDocument();
    });
  });
});