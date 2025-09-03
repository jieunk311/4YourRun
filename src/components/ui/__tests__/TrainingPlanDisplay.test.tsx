import { render, screen } from '@testing-library/react';
import TrainingPlanDisplay from '../TrainingPlanDisplay';
import { TrainingPlan, TrainingWeek } from '@/types';

// Mock the child components
jest.mock('../TrainingSummary', () => {
  return function MockTrainingSummary() {
    return <div data-testid="training-summary">Training Summary</div>;
  };
});

// ProgressChart removed - no longer needed

jest.mock('../WeeklyTrainingCard', () => {
  return function MockWeeklyTrainingCard({ trainingWeek }: { trainingWeek: TrainingWeek }) {
    return <div data-testid={`weekly-card-${trainingWeek.week}`}>Week {trainingWeek.week}</div>;
  };
});

const mockTrainingPlan: TrainingPlan = {
  weeks: [
    {
      week: 1,
      totalDistance: 20,
      trainingComposition: '3x Easy Run (5km each), 1x Rest',
      objectives: 'Build base fitness'
    },
    {
      week: 2,
      totalDistance: 25,
      trainingComposition: '3x Easy Run (6km each), 1x Long Run (7km)',
      objectives: 'Increase weekly volume'
    },
    {
      week: 3,
      totalDistance: 30,
      trainingComposition: '3x Easy Run (7km each), 1x Long Run (9km)',
      objectives: 'Continue building endurance'
    }
  ],
  totalWeeks: 3,
  totalDistance: 75,
  averageWeeklyDistance: 25,
  progressData: [20, 25, 30],
  aiFeedback: 'Great progress! Keep building gradually.'
};

describe('TrainingPlanDisplay', () => {
  it('renders all main components without header when no marathon name provided', () => {
    render(<TrainingPlanDisplay trainingPlan={mockTrainingPlan} />);
    
    expect(screen.getByTestId('training-plan-display')).toBeInTheDocument();
    expect(screen.getByTestId('training-summary')).toBeInTheDocument();
    expect(screen.getByText('주차별 훈련 계획')).toBeInTheDocument();
    expect(screen.queryByTestId('plan-header')).not.toBeInTheDocument();
  });

  it('renders header when marathon name is provided', () => {
    render(
      <TrainingPlanDisplay 
        trainingPlan={mockTrainingPlan} 
        marathonName="서울 마라톤"
        targetTime={{ hours: 4, minutes: 30, seconds: 0 }}
      />
    );
    
    expect(screen.getByTestId('plan-header')).toBeInTheDocument();
    expect(screen.getByText('🎉 훈련 계획 완성!')).toBeInTheDocument();
    expect(screen.getByText('서울 마라톤을 위한 맞춤형 계획')).toBeInTheDocument();
    expect(screen.getByTestId('target-time')).toBeInTheDocument();
    expect(screen.getByText('목표 시간: 4:30:00')).toBeInTheDocument();
  });

  it('renders header without target time when not provided', () => {
    render(
      <TrainingPlanDisplay 
        trainingPlan={mockTrainingPlan} 
        marathonName="서울 마라톤"
      />
    );
    
    expect(screen.getByTestId('plan-header')).toBeInTheDocument();
    expect(screen.getByText('서울 마라톤을 위한 맞춤형 계획')).toBeInTheDocument();
    expect(screen.queryByTestId('target-time')).not.toBeInTheDocument();
  });

  it('renders all weekly training cards in scrollable container', () => {
    render(<TrainingPlanDisplay trainingPlan={mockTrainingPlan} />);
    
    expect(screen.getByTestId('weekly-cards-section')).toBeInTheDocument();
    expect(screen.getByTestId('weekly-cards-container')).toBeInTheDocument();
    expect(screen.getByTestId('weekly-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('weekly-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('weekly-card-3')).toBeInTheDocument();
  });

  it('applies scroll optimization classes to weekly cards container', () => {
    render(<TrainingPlanDisplay trainingPlan={mockTrainingPlan} />);
    
    const container = screen.getByTestId('weekly-cards-container');
    expect(container).toHaveClass('max-h-96');
    expect(container).toHaveClass('overflow-y-auto');
    expect(container).toHaveClass('overscroll-contain');
    expect(container).toHaveClass('scroll-smooth');
  });

  it('renders AI feedback when provided', () => {
    render(<TrainingPlanDisplay trainingPlan={mockTrainingPlan} />);
    
    expect(screen.getByTestId('ai-feedback')).toBeInTheDocument();
    expect(screen.getByText('AI 추천사항 및 팁')).toBeInTheDocument();
    expect(screen.getByText('Great progress! Keep building gradually.')).toBeInTheDocument();
  });

  it('does not render AI feedback when not provided', () => {
    const planWithoutFeedback: TrainingPlan = {
      ...mockTrainingPlan,
      aiFeedback: ''
    };
    
    render(<TrainingPlanDisplay trainingPlan={planWithoutFeedback} />);
    
    expect(screen.queryByTestId('ai-feedback')).not.toBeInTheDocument();
    expect(screen.queryByText('AI 추천사항 및 팁')).not.toBeInTheDocument();
  });

  it('handles empty weeks array gracefully', () => {
    const emptyPlan: TrainingPlan = {
      ...mockTrainingPlan,
      weeks: []
    };
    
    render(<TrainingPlanDisplay trainingPlan={emptyPlan} />);
    
    expect(screen.getByTestId('training-summary')).toBeInTheDocument();
    expect(screen.getByTestId('weekly-cards-section')).toBeInTheDocument();
    expect(screen.getByTestId('weekly-cards-container')).toBeInTheDocument();
  });

  it('maintains proper component order', () => {
    render(
      <TrainingPlanDisplay 
        trainingPlan={mockTrainingPlan} 
        marathonName="서울 마라톤"
      />
    );
    
    const container = screen.getByTestId('training-plan-display');
    const children = Array.from(container.children);
    
    // Header should be first (when provided)
    expect(children[0]).toContainElement(screen.getByTestId('plan-header'));
    // Training Summary should be second
    expect(children[1]).toContainElement(screen.getByTestId('training-summary'));
    // Weekly cards section should be third (after removing progress chart)
    expect(children[2]).toContainElement(screen.getByTestId('weekly-cards-section'));
    // AI feedback should be last (index 3 since we removed progress chart)
    expect(children[3]).toContainElement(screen.getByTestId('ai-feedback'));
  });

  it('formats target time correctly with zero padding', () => {
    render(
      <TrainingPlanDisplay 
        trainingPlan={mockTrainingPlan} 
        marathonName="서울 마라톤"
        targetTime={{ hours: 3, minutes: 5, seconds: 7 }}
      />
    );
    
    expect(screen.getByText('목표 시간: 3:05:07')).toBeInTheDocument();
  });
});