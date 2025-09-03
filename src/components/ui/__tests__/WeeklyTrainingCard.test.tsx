import { render, screen } from '@testing-library/react';
import WeeklyTrainingCard from '../WeeklyTrainingCard';
import { TrainingWeek } from '@/types';

const mockTrainingWeek: TrainingWeek = {
  week: 1,
  totalDistance: 25,
  trainingComposition: '3x Easy Run (5km each), 1x Long Run (10km)',
  objectives: 'Build aerobic base and establish running routine'
};

describe('WeeklyTrainingCard', () => {
  it('renders week number and total distance', () => {
    render(<WeeklyTrainingCard trainingWeek={mockTrainingWeek} />);
    
    expect(screen.getByText('Week 1')).toBeInTheDocument();
    expect(screen.getByText('25km')).toBeInTheDocument();
  });

  it('displays training composition', () => {
    render(<WeeklyTrainingCard trainingWeek={mockTrainingWeek} />);
    
    expect(screen.getByText('Training Composition')).toBeInTheDocument();
    expect(screen.getByText('3x Easy Run (5km each), 1x Long Run (10km)')).toBeInTheDocument();
  });

  it('displays training objectives when expanded', () => {
    render(<WeeklyTrainingCard trainingWeek={mockTrainingWeek} isExpanded={true} />);
    
    expect(screen.getByText('Training Objectives')).toBeInTheDocument();
    expect(screen.getByText('Build aerobic base and establish running routine')).toBeInTheDocument();
  });

  it('has proper mobile-optimized styling classes', () => {
    const { container } = render(<WeeklyTrainingCard trainingWeek={mockTrainingWeek} />);
    const card = container.firstChild as HTMLElement;
    
    expect(card).toHaveClass('touch-manipulation');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('shadow-md');
  });

  it('renders different week numbers correctly', () => {
    const week5: TrainingWeek = {
      ...mockTrainingWeek,
      week: 5,
      totalDistance: 40
    };
    
    render(<WeeklyTrainingCard trainingWeek={week5} />);
    
    expect(screen.getByText('Week 5')).toBeInTheDocument();
    expect(screen.getByText('40km')).toBeInTheDocument();
  });
});