export interface MarathonInfo {
  raceName: string;
  raceDate: Date;
  distance: '5km' | '10km' | 'Half' | 'Full';
  targetTime: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export interface RunningRecord {
  recordDate: Date;
  distance: number; // in kilometers
  time: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export interface TrainingWeek {
  week: number;
  totalDistance: number;
  trainingComposition: string;
  objectives: string;
}

export interface TrainingPlan {
  weeks: TrainingWeek[];
  totalWeeks: number;
  totalDistance: number;
  averageWeeklyDistance: number;
  progressData: number[];
  aiFeedback: string;
}

export interface FormData {
  marathonInfo: MarathonInfo;
  runningHistory: RunningRecord[];
  hasRunningHistory: boolean;
}