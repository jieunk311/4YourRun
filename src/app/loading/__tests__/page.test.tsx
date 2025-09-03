import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import LoadingPage from '../page';
import { useAppContext } from '../../../contexts/AppContext';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock AppContext
jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

// Mock components
jest.mock('../../../components/layout', () => ({
  MobileLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="mobile-layout">{children}</div>,
  ProgressIndicator: ({ currentStep }: { currentStep: string }) => <div data-testid="progress-indicator">{currentStep}</div>,
}));

jest.mock('../../../components/ui', () => ({
  LoadingAnimation: () => <div data-testid="loading-animation">Loading Animation</div>,
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('LoadingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  it('renders loading animation when in loading state with marathon info', () => {
    mockUseAppContext.mockReturnValue({
      state: {
        currentStep: 'loading',
        marathonInfo: { raceName: 'Test Marathon', raceDate: new Date(), distance: 'Full', targetTime: { hours: 4, minutes: 0, seconds: 0 } },
        runningHistory: [],
        hasRunningHistory: false,
        trainingPlan: null,
      },
      setCurrentStep: jest.fn(),
      setMarathonInfo: jest.fn(),
      setRunningHistory: jest.fn(),
      setHasRunningHistory: jest.fn(),
      setTrainingPlan: jest.fn(),
      resetState: jest.fn(),
    });

    render(<LoadingPage />);

    expect(screen.getByTestId('mobile-layout')).toBeInTheDocument();
    expect(screen.getByTestId('progress-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('redirects to home when not in loading state', () => {
    mockUseAppContext.mockReturnValue({
      state: {
        currentStep: 'home',
        marathonInfo: null,
        runningHistory: [],
        hasRunningHistory: false,
        trainingPlan: null,
      },
      setCurrentStep: jest.fn(),
      setMarathonInfo: jest.fn(),
      setRunningHistory: jest.fn(),
      setHasRunningHistory: jest.fn(),
      setTrainingPlan: jest.fn(),
      resetState: jest.fn(),
    });

    render(<LoadingPage />);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('redirects to home when marathon info is missing', () => {
    mockUseAppContext.mockReturnValue({
      state: {
        currentStep: 'loading',
        marathonInfo: null,
        runningHistory: [],
        hasRunningHistory: false,
        trainingPlan: null,
      },
      setCurrentStep: jest.fn(),
      setMarathonInfo: jest.fn(),
      setRunningHistory: jest.fn(),
      setHasRunningHistory: jest.fn(),
      setTrainingPlan: jest.fn(),
      resetState: jest.fn(),
    });

    render(<LoadingPage />);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('redirects to results when training plan already exists', () => {
    mockUseAppContext.mockReturnValue({
      state: {
        currentStep: 'loading',
        marathonInfo: { raceName: 'Test Marathon', raceDate: new Date(), distance: 'Full', targetTime: { hours: 4, minutes: 0, seconds: 0 } },
        runningHistory: [],
        hasRunningHistory: false,
        trainingPlan: {
          weeks: [],
          totalWeeks: 0,
          totalDistance: 0,
          averageWeeklyDistance: 0,
          progressData: [],
          aiFeedback: 'Test feedback'
        },
      },
      setCurrentStep: jest.fn(),
      setMarathonInfo: jest.fn(),
      setRunningHistory: jest.fn(),
      setHasRunningHistory: jest.fn(),
      setTrainingPlan: jest.fn(),
      resetState: jest.fn(),
    });

    render(<LoadingPage />);

    expect(mockPush).toHaveBeenCalledWith('/result');
  });

  it('passes loading step to ProgressIndicator', () => {
    mockUseAppContext.mockReturnValue({
      state: {
        currentStep: 'loading',
        marathonInfo: { raceName: 'Test Marathon', raceDate: new Date(), distance: 'Full', targetTime: { hours: 4, minutes: 0, seconds: 0 } },
        runningHistory: [],
        hasRunningHistory: false,
        trainingPlan: null,
      },
      setCurrentStep: jest.fn(),
      setMarathonInfo: jest.fn(),
      setRunningHistory: jest.fn(),
      setHasRunningHistory: jest.fn(),
      setTrainingPlan: jest.fn(),
      resetState: jest.fn(),
    });

    render(<LoadingPage />);

    expect(screen.getByTestId('progress-indicator')).toHaveTextContent('loading');
  });
});