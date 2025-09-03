import { TrainingPlan } from '@/types';

interface TrainingSummaryProps {
  trainingPlan: TrainingPlan;
}

export default function TrainingSummary({ trainingPlan }: TrainingSummaryProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Training Plan Summary</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {trainingPlan.totalWeeks}
          </div>
          <div className="text-sm text-gray-600">Total Weeks</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {trainingPlan.totalDistance}km
          </div>
          <div className="text-sm text-gray-600">Total Distance</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow-sm col-span-2">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {trainingPlan.averageWeeklyDistance}km
          </div>
          <div className="text-sm text-gray-600">Average Weekly Distance</div>
        </div>
      </div>
    </div>
  );
}