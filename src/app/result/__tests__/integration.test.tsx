import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ResultPage from '../page';
import { useAppContext } from '../../../contexts/AppContext';
import { MarathonInfo } from '../../../lib/validations';

// Mock dependencies
jest.mock('next/navigation');
jest.mock('../../../contexts/AppContext');
jest.mock('../../../components/ui/TrainingSummary', () => {
  return function MockTrainingSummary() {
    return <div data-testid="training-summary">Training Plan Summary</div>;
  };
});
// ProgressChart removed - no longer needed
jest.mock('../../../components/ui/WeeklyTrainingCard', () => {
  return function MockWeeklyTrainingCard({ trainingWeek }: { trainingWeek: any }) {
    return <div data-testid={`weekly-card-${trainingWeek.week}`}>Week {trainingWeek.week}</div>;
  };
});

const mockPush = jest.fn();
const mockSetCurrentStep = jest.fn();
const mockResetState = jest.fn();

const mockMarathonInfo: MarathonInfo = {
  raceName: 'Seoul Marathon 2024',
  raceDate: new Date('2024-12-01'),
  distance: 'Full',
  targetTime: { hours: 4, minutes: 0, seconds: 0 }
};

const mockTrainingPlan = {
  weeks: [
    {
      week: 1,
      totalDistance: 25,
      trainingComposition: '3x Easy Run (6km), 1x Long Run (7km)',
      objectives: 'Build aerobic base and running consistency'
    },
    {
      week: 2,
      totalDistance: 30,
      trainingComposition: '3x Easy Run (7km), 1x Long Run (9km)',
      objectives: 'Increase weekly volume gradually'
    },
    {
      week: 3,
      totalDistance: 35,
      trainingComposition: '2x Easy Run (8km), 1x Tempo Run (6km), 1x Long Run (13km)',
      objectives: 'Introduce tempo work and extend long run'
    }
  ],
  totalWeeks: 3,
  totalDistance: 90,
  averageWeeklyDistance: 30,
  progressData: [25, 30, 35],
  aiFeedback: '훌륭한 시작입니다! 점진적인 거리 증가로 부상 위험을 최소화하면서 지구력을 향상시킬 수 있습니다. 템포 런을 통해 목표 페이스에 익숙해지고, 장거리 달리기로 마라톤 완주를 위한 체력을 기르세요.'
};

describe('ResultPage Integration', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
    
    jest.clearAllMocks();
  });

  it('displays complete training plan with all components integrated', () => {
    (useAppContext as jest.Mock).mockReturnValue({
      state: {
        trainingPlan: mockTrainingPlan,
        marathonInfo: mockMarathonInfo
      },
      setCurrentStep: mockSetCurrentStep,
      resetState: mockResetState
    });

    render(<ResultPage />);

    // Verify header information
    expect(screen.getByText('🎉 훈련 계획 완성!')).toBeInTheDocument();
    expect(screen.getByText('Seoul Marathon 2024을 위한 맞춤형 계획')).toBeInTheDocument();
    expect(screen.getByText('목표 시간: 4:00:00')).toBeInTheDocument();

    // Verify training summary statistics
    expect(screen.getByTestId('training-summary')).toBeInTheDocument();

    // Progress chart removed

    // Verify weekly training cards
    expect(screen.getByText('주차별 훈련 계획')).toBeInTheDocument();
    
    // Verify AI feedback (may be lazy loaded, so check for fallback or content)
    const aiFeedbackSection = screen.queryByText('AI 추천사항 및 팁');
    if (aiFeedbackSection) {
      expect(aiFeedbackSection).toBeInTheDocument();
      expect(screen.getByText(mockTrainingPlan.aiFeedback)).toBeInTheDocument();
    } else {
      // Check for lazy loading placeholder
      expect(screen.getByTestId('lazy-section-placeholder')).toBeInTheDocument();
    }

    // Verify navigation buttons
    expect(screen.getByText('계획 수정하기')).toBeInTheDocument();
    expect(screen.getByText('새로운 계획 만들기')).toBeInTheDocument();
  });

  it('handles user interactions correctly', () => {
    (useAppContext as jest.Mock).mockReturnValue({
      state: {
        trainingPlan: mockTrainingPlan,
        marathonInfo: mockMarathonInfo
      },
      setCurrentStep: mockSetCurrentStep,
      resetState: mockResetState
    });

    render(<ResultPage />);

    // Test edit plan button
    const editButton = screen.getByText('계획 수정하기');
    fireEvent.click(editButton);
    
    expect(mockSetCurrentStep).toHaveBeenCalledWith('marathon-info');
    expect(mockPush).toHaveBeenCalledWith('/plan');

    // Test new plan button
    const newPlanButton = screen.getByText('새로운 계획 만들기');
    fireEvent.click(newPlanButton);
    
    expect(mockResetState).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('applies mobile-optimized layout and styling', () => {
    (useAppContext as jest.Mock).mockReturnValue({
      state: {
        trainingPlan: mockTrainingPlan,
        marathonInfo: mockMarathonInfo
      },
      setCurrentStep: mockSetCurrentStep,
      resetState: mockResetState
    });

    const { container } = render(<ResultPage />);

    // Check for mobile layout container
    const mobileLayout = container.querySelector('.max-w-md');
    expect(mobileLayout).toBeInTheDocument();

    // Check for progress indicator
    const progressIndicator = container.querySelector('.fixed.top-0');
    expect(progressIndicator).toBeInTheDocument();

    // Check for scroll container
    const scrollContainer = container.querySelector('.scroll-container');
    expect(scrollContainer).toBeInTheDocument();

    // Check for proper spacing
    const contentContainer = container.querySelector('.space-y-6');
    expect(contentContainer).toBeInTheDocument();
  });

  it('handles scroll optimization for long training plans', () => {
    const longTrainingPlan = {
      ...mockTrainingPlan,
      weeks: Array.from({ length: 20 }, (_, i) => ({
        week: i + 1,
        totalDistance: 20 + i * 2,
        trainingComposition: `Week ${i + 1} training composition`,
        objectives: `Week ${i + 1} objectives`
      })),
      totalWeeks: 20,
      totalDistance: 600,
      averageWeeklyDistance: 30,
      progressData: Array.from({ length: 20 }, (_, i) => 20 + i * 2)
    };

    (useAppContext as jest.Mock).mockReturnValue({
      state: {
        trainingPlan: longTrainingPlan,
        marathonInfo: mockMarathonInfo
      },
      setCurrentStep: mockSetCurrentStep,
      resetState: mockResetState
    });

    const { container } = render(<ResultPage />);

    // Check that scroll container has proper height constraint
    const scrollContainer = container.querySelector('.max-h-\\[60vh\\]');
    expect(scrollContainer).toBeInTheDocument();

    // Check for scroll optimization classes
    const scrollOptimized = container.querySelector('.overflow-y-auto.overscroll-contain.scroll-smooth');
    expect(scrollOptimized).toBeInTheDocument();
  });

  it('maintains accessibility standards', () => {
    (useAppContext as jest.Mock).mockReturnValue({
      state: {
        trainingPlan: mockTrainingPlan,
        marathonInfo: mockMarathonInfo
      },
      setCurrentStep: mockSetCurrentStep,
      resetState: mockResetState
    });

    render(<ResultPage />);

    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();

    // Check for button accessibility
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('type', 'button');
    });

    const { container } = render(<ResultPage />);
    
    // Check for proper focus management
    const focusableElements = container.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    expect(focusableElements.length).toBeGreaterThan(0);
  });
});