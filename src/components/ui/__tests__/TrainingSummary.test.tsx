import { render, screen } from '@testing-library/react';
import TrainingSummary from '../TrainingSummary';
import { TrainingPlan } from '@/types';

const mockTrainingPlan: TrainingPlan = {
  weeks: [],
  totalWeeks: 12,
  totalDistance: 300,
  averageWeeklyDistance: 25,
  progressData: [20, 25, 30, 35, 40, 35, 30, 35, 40, 45, 30, 20],
  aiFeedback: 'Focus on gradual progression and listen to your body. Include rest days for recovery.'
};

describe('TrainingSummary', () => {
  it('renders training plan summary title', () => {
    render(<TrainingSummary trainingPlan={mockTrainingPlan} />);
    
    expect(screen.getByText('Training Plan Summary')).toBeInTheDocument();
  });

  it('displays total weeks statistic', () => {
    render(<TrainingSummary trainingPlan={mockTrainingPlan} />);
    
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Total Weeks')).toBeInTheDocument();
  });

  it('displays total distance statistic', () => {
    render(<TrainingSummary trainingPlan={mockTrainingPlan} />);
    
    expect(screen.getByText('300km')).toBeInTheDocument();
    expect(screen.getByText('Total Distance')).toBeInTheDocument();
  });

  it('displays average weekly distance statistic', () => {
    render(<TrainingSummary trainingPlan={mockTrainingPlan} />);
    
    expect(screen.getByText('25km')).toBeInTheDocument();
    expect(screen.getByText('Average Weekly Distance')).toBeInTheDocument();
  });



  it('has proper mobile-optimized grid layout', () => {
    const { container } = render(<TrainingSummary trainingPlan={mockTrainingPlan} />);
    const gridContainer = container.querySelector('.grid');
    
    expect(gridContainer).toHaveClass('grid-cols-2');
    expect(gridContainer).toHaveClass('gap-4');
  });
});