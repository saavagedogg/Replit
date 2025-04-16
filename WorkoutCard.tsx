import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Workout, Exercise } from "@shared/schema";
import { useLocation } from "wouter";

interface WorkoutCardProps {
  workout: Workout;
  exercises: Exercise[];
  totalExercises: number;
  completedExercises: number;
}

export default function WorkoutCard({ 
  workout, 
  exercises,
  totalExercises, 
  completedExercises 
}: WorkoutCardProps) {
  const [_, navigate] = useLocation();
  
  const getWorkoutExercise = (exerciseId: number) => {
    return exercises.find(e => e.id === exerciseId);
  };
  
  const getWorkoutAgeRange = () => {
    const firstExercise = workout.completedExercises[0];
    if (!firstExercise) return "All Ages";
    
    const exercise = getWorkoutExercise(firstExercise.exerciseId);
    return exercise?.ageRange || "All Ages";
  };

  const getDuration = () => {
    return `${Math.round(workout.duration / 60)} min`;
  };
  
  const getIntensity = () => {
    // Calculate intensity based on exercise difficulty
    const difficultyLevels = workout.completedExercises.map(ex => {
      const exercise = getWorkoutExercise(ex.exerciseId);
      return exercise?.difficulty || "Beginner";
    });
    
    if (difficultyLevels.includes("Advanced")) return "High Intensity";
    if (difficultyLevels.includes("Intermediate")) return "Medium Intensity";
    return "Low Intensity";
  };
  
  const getProgress = () => {
    return (completedExercises / totalExercises) * 100;
  };
  
  const handleContinue = () => {
    // Navigate to the workout detail/start page
    navigate(`/routines/${workout.routineId}`);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">
              {exercises.find(e => e.id === workout.completedExercises[0]?.exerciseId)?.name || "Custom Workout"}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <span className="inline-block bg-indigo-100 text-primary rounded-full px-2 py-0.5 mr-2 text-xs">
                {getWorkoutAgeRange()}
              </span>
              <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {getDuration()}</span>
              <span className="mx-2">•</span>
              <span>{getIntensity()}</span>
            </div>
          </div>
          <Button 
            variant="default" 
            size="icon" 
            className="rounded-full" 
            onClick={handleContinue}
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
        
        <Progress 
          value={getProgress()} 
          max={100}
          className="h-1.5 mb-4" 
        />
        
        <div className="text-sm text-gray-500">
          {completedExercises} of {totalExercises} exercises completed ({Math.round(getProgress())}%)
        </div>
      </div>
      
      <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
        <div className="flex items-center text-sm">
          <Info className="text-primary mr-2 h-4 w-4" />
          <span>Continue where you left off</span>
        </div>
      </div>
    </div>
  );
}

// Helper components that would be imported from lucide-react
const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const Info = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);
