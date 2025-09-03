'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MarathonInfo, RunningRecord } from '@/lib/validations';

export type Step = 'home' | 'marathon-info' | 'running-history' | 'loading' | 'result';

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

interface AppState {
  currentStep: Step;
  marathonInfo: MarathonInfo | null;
  runningHistory: RunningRecord[];
  hasRunningHistory: boolean;
  trainingPlan: TrainingPlan | null;
}

interface AppContextType {
  state: AppState;
  setCurrentStep: (step: Step) => void;
  setMarathonInfo: (info: MarathonInfo) => void;
  setRunningHistory: (history: RunningRecord[]) => void;
  setHasRunningHistory: (hasHistory: boolean) => void;
  setTrainingPlan: (plan: TrainingPlan) => void;
  resetState: () => void;
}

const initialState: AppState = {
  currentStep: 'home',
  marathonInfo: null,
  runningHistory: [],
  hasRunningHistory: false,
  trainingPlan: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const setCurrentStep = useCallback((step: Step) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const setMarathonInfo = useCallback((info: MarathonInfo) => {
    setState(prev => ({ ...prev, marathonInfo: info }));
  }, []);

  const setRunningHistory = useCallback((history: RunningRecord[]) => {
    setState(prev => ({ ...prev, runningHistory: history }));
  }, []);

  const setHasRunningHistory = useCallback((hasHistory: boolean) => {
    setState(prev => ({ ...prev, hasRunningHistory: hasHistory }));
  }, []);

  const setTrainingPlan = useCallback((plan: TrainingPlan) => {
    setState(prev => ({ ...prev, trainingPlan: plan }));
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  const value: AppContextType = {
    state,
    setCurrentStep,
    setMarathonInfo,
    setRunningHistory,
    setHasRunningHistory,
    setTrainingPlan,
    resetState,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}