import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ResultPage from '../page';
import { useAppContext } from '../../../contexts/AppContext';
import { MarathonInfo } from '../../../lib/validations';

interface TrainingWeek {
  week: number;
  totalDistance: number;
  trainingComposition: string;
  objectives: string;
}

interface TrainingPlan {
  weeks: TrainingWeek[];
  totalWeeks: number;
  totalDistance: number;
  averageWeeklyDistance: number;
  progressData: number[];
  aiFeedback: string;
}

// Mock dependencies
jest.mock('next/navigation');
jest.mock('../../../contexts/AppContext');
jest.mock('../../../components/ui/TrainingSummary', () => {
  return function MockTrainingSummary({ trainingPlan }: { trainingPlan: TrainingPlan }) {
    return <div data-testid="training-summary">Training Summary: {trainingPlan.totalWeeks} weeks</div>;
  };
});
jest.mock('../../../components/ui/WeeklyTrainingCard', () => {
  return function MockWeeklyTrainingCard({ trainingWeek }: { trainingWeek: TrainingWeek }) {
    return <div data-testid={`week-card-${trainingWeek.week}`}>Week {trainingWeek.week}</div>;
  };
});
// ProgressChart removed - no longer needed

const mockPush = jest.fn();
const mockSetCurrentStep = jest.fn();
const mockResetState = jest.fn();

const mockMarathonInfo: MarathonInfo = {
  raceName: 'Test Marathon',
  raceDate: new Date('2024-12-01'),
  distance: 'Full',
  targetTime: { hours: 4, minutes: 30, seconds: 0 }
};

const mockTrainingPlan: TrainingPlan = {
  weeks: [
    {
      week: 1,
      totalDistance: 20,
      trainingComposition: 'Easy runs and recovery',
      objectives: 'Build base fitness'
    },
    {
      week: 2,
      totalDistance: 25,
      trainingComposition: 'Easy runs with tempo',
      objectives: 'Increase endurance'
    }
  ],
  totalWeeks: 2,
  totalDistance: 45,
  averageWeeklyDistance: 22.5,
  progressData: [20, 25],
  aiFeedback: 'Focus on consistency and gradual progression.'
};

describe('ResultPage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
    
    jest.clearAllMocks();
  });

  it('redirects to home when no training plan or marathon info exists', async () => {
    (useAppContext as jest.Mock).mockReturnValue({
      state: {
        trainingPlan: null,
        marathonInfo: null
      },
      setCurrentStep: mockSetCurrentStep,
      resetState: mockResetState
    });

    render(<ResultPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows loading state when marathon info exists but no training plan', () => {
    (useAppContext as jest.Mock).mockReturnValue({
      state: {
        trainingPlan: null,
        marathonInfo: mockMarathonInfo
      },
      setCurrentStep: mockSetCurrentStep,
      resetState: mockResetState
    });

    render(<ResultPage />);

    expect(screen.getByText('훈련 계획 생성 중...')).toBeInTheDocument();
    expect(screen.getByText('AI가 맞춤형 훈련 계획을 생성하고 있습니다.')).toBeInTheDocument();
  });

  it('displays complete training plan when data is available', () => {
    (useAppContext as jest.Mock).mockReturnValue({
      state: {
        trainingPlan: mockTrainingPlan,
        marathonInfo: mockMarathonInfo
      },
      setCurrentStep: mockSetCurrentStep,
      resetState: mockResetState
    });

    render(<ResultPage />);

    // Check header
    expect(screen.getByText('🎉 훈련 계획 완성!')).toBeInTheDocument();
    expect(screen.getByText('Test Marathon을 위한 맞춤형 계획')).toBeInTheDocument();
    expect(screen.getByText('목표 시간: 4:30:00')).toBeInTheDocument();

    // Check components are rendered
    expect(screen.getByTestId('training-summary')).toBeInTheDocument();
    
    // Check weekly cards
    expect(screen.getByTestId('week-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('week-card-2')).toBeInTheDocument();

    // Check lazy section placeholder is shown initially
    expect(screen.getByTestId('lazy-section-placeholder')).toBeInTheDocument();
  });

  it('handles navigation buttons correctly', () => {
    (useAppContext as jest.Mock).mockReturnValue({
      state: {
        trainingPlan: mockTrainingPlan,
        marathonInfo: mockMarathonInfo
      },
      setCurrentStep: mockSetCurrentStep,
      resetState: mockResetState
    });

    render(<ResultPage />);

    // Test "계획 수정하기" button
    const editButton = screen.getByText('계획 수정하기');
    fireEvent.click(editButton);
    
    expect(mockSetCurrentStep).toHaveBeenCalledWith('marathon-info');
    expect(mockPush).toHaveBeenCalledWith('/plan');

    // Test "새로운 계획 만들기" button
    const newPlanButton = screen.getByText('새로운 계획 만들기');
    fireEvent.click(newPlanButton);
    
    expect(mockResetState).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('sets current step to result on mount', () => {
    (useAppContext as jest.Mock).mockReturnValue({
      state: {
        trainingPlan: mockTrainingPlan,
        marathonInfo: mockMarathonInfo
      },
      setCurrentStep: mockSetCurrentStep,
      resetState: mockResetState
    });

    render(<ResultPage />);

    expect(mockSetCurrentStep).toHaveBeenCalledWith('result');
  });

  it('displays scrollable weekly training cards', () => {
    const longTrainingPlan = {
      ...mockTrainingPlan,
      weeks: Array.from({ length: 10 }, (_, i) => ({
        week: i + 1,
        totalDistance: 20 + i * 2,
        trainingComposition: `Week ${i + 1} composition`,
        objectives: `Week ${i + 1} objectives`
      }))
    };

    (useAppContext as jest.Mock).mockReturnValue({
      state: {
        trainingPlan: longTrainingPlan,
        marathonInfo: mockMarathonInfo
      },
      setCurrentStep: mockSetCurrentStep,
      resetState: mockResetState
    });

    render(<ResultPage />);

    // Check that all weeks are rendered
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByTestId(`week-card-${i}`)).toBeInTheDocument();
    }

    // Check scroll container exists
    const scrollContainer = screen.getByText('주차별 훈련 계획').parentElement?.querySelector('.overflow-y-auto');
    expect(scrollContainer).toBeInTheDocument();
  });

  it('handles missing AI feedback gracefully', () => {
    const planWithoutFeedback = {
      ...mockTrainingPlan,
      aiFeedback: ''
    };

    (useAppContext as jest.Mock).mockReturnValue({
      state: {
        trainingPlan: planWithoutFeedback,
        marathonInfo: mockMarathonInfo
      },
      setCurrentStep: mockSetCurrentStep,
      resetState: mockResetState
    });

    render(<ResultPage />);

    // AI feedback section should not be rendered
    expect(screen.queryByText('AI 추천사항 및 팁')).not.toBeInTheDocument();
  });

  it('applies mobile-optimized styling', () => {
    (useAppContext as jest.Mock).mockReturnValue({
      state: {
        trainingPlan: mockTrainingPlan,
        marathonInfo: mockMarathonInfo
      },
      setCurrentStep: mockSetCurrentStep,
      resetState: mockResetState
    });

    const { container } = render(<ResultPage />);

    // Check for mobile layout classes
    const mobileLayout = container.querySelector('.max-w-md');
    expect(mobileLayout).toBeInTheDocument();

    // Check for touch-friendly spacing
    const contentContainer = container.querySelector('.space-y-6');
    expect(contentContainer).toBeInTheDocument();
  });
});