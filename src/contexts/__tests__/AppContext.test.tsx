import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider, useAppContext } from '../AppContext';

// Test component to interact with context
function TestComponent() {
  const {
    state,
    setCurrentStep,
    setMarathonInfo,
    setRunningHistory,
    setHasRunningHistory,
    setTrainingPlan,
    resetState,
  } = useAppContext();

  return (
    <div>
      <div data-testid="current-step">{state.currentStep}</div>
      <div data-testid="has-marathon-info">{state.marathonInfo ? 'yes' : 'no'}</div>
      <div data-testid="has-running-history">{state.hasRunningHistory ? 'yes' : 'no'}</div>
      <div data-testid="running-history-count">{state.runningHistory.length}</div>
      <div data-testid="has-training-plan">{state.trainingPlan ? 'yes' : 'no'}</div>
      
      <button onClick={() => setCurrentStep('marathon-info')}>
        Set Marathon Info Step
      </button>
      <button onClick={() => setCurrentStep('running-history')}>
        Set Running History Step
      </button>
      <button onClick={() => setCurrentStep('result')}>
        Set Result Step
      </button>
      
      <button onClick={() => setMarathonInfo({
        raceName: 'Test Marathon',
        raceDate: new Date('2024-12-31'),
        distance: 'Full',
        targetTime: { hours: 4, minutes: 0, seconds: 0 }
      })}>
        Set Marathon Info
      </button>
      
      <button onClick={() => setRunningHistory([{
        recordDate: new Date('2024-01-01'),
        distance: 10,
        time: { hours: 1, minutes: 0, seconds: 0 }
      }])}>
        Set Running History
      </button>
      
      <button onClick={() => setHasRunningHistory(true)}>
        Set Has Running History
      </button>
      
      <button onClick={() => setTrainingPlan({
        weeks: [],
        totalWeeks: 12,
        totalDistance: 300,
        averageWeeklyDistance: 25,
        progressData: [],
        aiFeedback: 'Test feedback'
      })}>
        Set Training Plan
      </button>
      
      <button onClick={resetState}>
        Reset State
      </button>
    </div>
  );
}

describe('AppContext', () => {
  const renderWithProvider = () => {
    return render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
  };

  it('should provide initial state', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('current-step')).toHaveTextContent('home');
    expect(screen.getByTestId('has-marathon-info')).toHaveTextContent('no');
    expect(screen.getByTestId('has-running-history')).toHaveTextContent('no');
    expect(screen.getByTestId('running-history-count')).toHaveTextContent('0');
    expect(screen.getByTestId('has-training-plan')).toHaveTextContent('no');
  });

  it('should update current step', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Set Marathon Info Step'));
    expect(screen.getByTestId('current-step')).toHaveTextContent('marathon-info');
    
    fireEvent.click(screen.getByText('Set Running History Step'));
    expect(screen.getByTestId('current-step')).toHaveTextContent('running-history');
    
    fireEvent.click(screen.getByText('Set Result Step'));
    expect(screen.getByTestId('current-step')).toHaveTextContent('result');
  });

  it('should update marathon info', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('has-marathon-info')).toHaveTextContent('no');
    
    fireEvent.click(screen.getByText('Set Marathon Info'));
    expect(screen.getByTestId('has-marathon-info')).toHaveTextContent('yes');
  });

  it('should update running history', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('running-history-count')).toHaveTextContent('0');
    
    fireEvent.click(screen.getByText('Set Running History'));
    expect(screen.getByTestId('running-history-count')).toHaveTextContent('1');
  });

  it('should update has running history flag', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('has-running-history')).toHaveTextContent('no');
    
    fireEvent.click(screen.getByText('Set Has Running History'));
    expect(screen.getByTestId('has-running-history')).toHaveTextContent('yes');
  });

  it('should update training plan', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('has-training-plan')).toHaveTextContent('no');
    
    fireEvent.click(screen.getByText('Set Training Plan'));
    expect(screen.getByTestId('has-training-plan')).toHaveTextContent('yes');
  });

  it('should reset state to initial values', () => {
    renderWithProvider();
    
    // Set some state
    fireEvent.click(screen.getByText('Set Marathon Info Step'));
    fireEvent.click(screen.getByText('Set Marathon Info'));
    fireEvent.click(screen.getByText('Set Running History'));
    fireEvent.click(screen.getByText('Set Has Running History'));
    fireEvent.click(screen.getByText('Set Training Plan'));
    
    // Verify state is set
    expect(screen.getByTestId('current-step')).toHaveTextContent('marathon-info');
    expect(screen.getByTestId('has-marathon-info')).toHaveTextContent('yes');
    expect(screen.getByTestId('running-history-count')).toHaveTextContent('1');
    expect(screen.getByTestId('has-running-history')).toHaveTextContent('yes');
    expect(screen.getByTestId('has-training-plan')).toHaveTextContent('yes');
    
    // Reset state
    fireEvent.click(screen.getByText('Reset State'));
    
    // Verify state is reset
    expect(screen.getByTestId('current-step')).toHaveTextContent('home');
    expect(screen.getByTestId('has-marathon-info')).toHaveTextContent('no');
    expect(screen.getByTestId('running-history-count')).toHaveTextContent('0');
    expect(screen.getByTestId('has-running-history')).toHaveTextContent('no');
    expect(screen.getByTestId('has-training-plan')).toHaveTextContent('no');
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAppContext must be used within an AppProvider');
    
    consoleSpy.mockRestore();
  });
});