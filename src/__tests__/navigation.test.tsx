import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { AppProvider } from '@/contexts/AppContext';
import Home from '@/app/page';
import PlanPage from '@/app/plan/page';
import ResultPage from '@/app/result/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
};

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  mockPush.mockClear();
});

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <AppProvider>
      {component}
    </AppProvider>
  );
};

describe('Navigation Flow', () => {
  describe('Home Page', () => {
    it('should render home page with service introduction', () => {
      renderWithProvider(<Home />);
      
      expect(screen.getByText('🏃‍♂️ 4YourRun')).toBeInTheDocument();
      expect(screen.getByText('마라톤 목표 달성을 위한')).toBeInTheDocument();
      expect(screen.getByText('AI 기반 개인 맞춤형 러닝 플래너')).toBeInTheDocument();
      expect(screen.getByText('어떻게 도와드릴까요?')).toBeInTheDocument();
    });

    it('should display service features', () => {
      renderWithProvider(<Home />);
      
      expect(screen.getByText('마라톤 목표에 맞는 개인 맞춤형 훈련 계획')).toBeInTheDocument();
      expect(screen.getByText('최근 러닝 기록을 반영한 AI 분석')).toBeInTheDocument();
      expect(screen.getByText('주차별 상세 훈련 가이드 제공')).toBeInTheDocument();
    });

    it('should navigate to plan page when start button is clicked', () => {
      renderWithProvider(<Home />);
      
      const startButton = screen.getByText('시작하기');
      fireEvent.click(startButton);
      
      expect(mockPush).toHaveBeenCalledWith('/plan');
    });

    it('should have mobile-optimized layout', () => {
      renderWithProvider(<Home />);
      
      const startButton = screen.getByText('시작하기');
      expect(startButton).toHaveClass('w-full', 'min-h-[44px]');
    });
  });

  describe('Plan Page', () => {
    it('should render marathon info form initially', () => {
      renderWithProvider(<PlanPage />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('마라톤 정보')).toBeInTheDocument();
    });

    it('should navigate back to home when back button is clicked', () => {
      renderWithProvider(<PlanPage />);
      
      const backButton = screen.getByText('이전');
      fireEvent.click(backButton);
      
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should progress to running history step after marathon info submission', async () => {
      renderWithProvider(<PlanPage />);
      
      // Fill out marathon info form
      const raceNameInput = screen.getByLabelText('대회명');
      const raceDateInput = screen.getByLabelText('대회 날짜');
      const distanceSelect = screen.getByRole('button', { name: '참가 거리' });
      const hoursInput = screen.getByPlaceholderText('시');
      const minutesInput = screen.getByPlaceholderText('분');
      const secondsInput = screen.getByPlaceholderText('초');
      
      fireEvent.change(raceNameInput, { target: { value: '서울 마라톤' } });
      fireEvent.change(raceDateInput, { target: { value: '2024-12-31' } });
      fireEvent.click(distanceSelect);
      const fullOption = screen.getByRole('option', { name: /Full/ });
      fireEvent.click(fullOption);
      fireEvent.change(hoursInput, { target: { value: '4' } });
      fireEvent.change(minutesInput, { target: { value: '0' } });
      fireEvent.change(secondsInput, { target: { value: '0' } });
      
      const nextButton = screen.getByRole('button', { name: '다음 단계' });
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('러닝 기록')).toBeInTheDocument();
      });
    });
  });

  describe('Result Page', () => {
    it('should redirect to home if no training plan data', () => {
      renderWithProvider(<ResultPage />);
      
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should display loading state when no training plan is available', () => {
      // Mock context with marathon info but no training plan
      const TestComponent = () => {
        return (
          <AppProvider>
            <ResultPage />
          </AppProvider>
        );
      };
      
      render(<TestComponent />);
      
      expect(screen.getByText('훈련 계획 생성 중...')).toBeInTheDocument();
      expect(screen.getByText('AI가 맞춤형 훈련 계획을 생성하고 있습니다.')).toBeInTheDocument();
    });

    it('should provide navigation options in loading state', () => {
      renderWithProvider(<ResultPage />);
      
      expect(screen.getByText('계획 수정하기')).toBeInTheDocument();
      expect(screen.getByText('처음부터 다시')).toBeInTheDocument();
    });

    it('should navigate back to plan when modify button is clicked', () => {
      renderWithProvider(<ResultPage />);
      
      const modifyButton = screen.getByText('계획 수정하기');
      fireEvent.click(modifyButton);
      
      expect(mockPush).toHaveBeenCalledWith('/plan');
    });

    it('should navigate to home when start over button is clicked', () => {
      renderWithProvider(<ResultPage />);
      
      const startOverButton = screen.getByText('처음부터 다시');
      fireEvent.click(startOverButton);
      
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('Step-based Navigation Logic', () => {
    it('should maintain step state across navigation', async () => {
      renderWithProvider(<PlanPage />);
      
      // Should start at step 1
      expect(screen.getByText('1')).toBeInTheDocument();
      
      // Fill and submit marathon info
      const raceNameInput = screen.getByLabelText('대회명');
      fireEvent.change(raceNameInput, { target: { value: '서울 마라톤' } });
      
      const raceDateInput = screen.getByLabelText('대회 날짜');
      fireEvent.change(raceDateInput, { target: { value: '2024-12-31' } });
      
      const nextButton = screen.getByRole('button', { name: '다음 단계' });
      fireEvent.click(nextButton);
      
      // Should progress to step 2
      await waitFor(() => {
        expect(screen.getByText('러닝 기록')).toBeInTheDocument();
      });
      
      // Go back to step 1
      const backButton = screen.getByText('이전');
      fireEvent.click(backButton);
      
      await waitFor(() => {
        expect(screen.getByText('마라톤 정보')).toBeInTheDocument();
      });
    });
  });

  describe('Mobile-First Responsive Design', () => {
    it('should have mobile-optimized button sizes', () => {
      renderWithProvider(<Home />);
      
      const startButton = screen.getByText('시작하기');
      expect(startButton).toHaveClass('min-h-[44px]'); // Thumb-friendly size
    });

    it('should use mobile-optimized card layouts', () => {
      renderWithProvider(<Home />);
      
      const serviceCard = screen.getByText('어떻게 도와드릴까요?').closest('div');
      expect(serviceCard).toHaveClass('bg-white', 'rounded-lg', 'p-6');
    });
  });
});