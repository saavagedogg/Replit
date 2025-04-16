import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useExercises } from "@/hooks/useExercises";
import { useRoutines } from "@/hooks/useRoutines";
import AgeIndicator from "@/components/dashboard/AgeIndicator";
import WorkoutCard from "@/components/dashboard/WorkoutCard";
import ExerciseList from "@/components/exercises/ExerciseList";
import RoutineCard from "@/components/workouts/RoutineCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user } = useUser();
  const { exercises, isLoading: exercisesLoading } = useExercises();
  const { routines, activeWorkout, startWorkout, isLoading: routinesLoading } = useRoutines();
  const [_, navigate] = useLocation();
  
  // Calculate exercise completion for active workout
  const totalExercises = activeWorkout?.completedExercises.length || 0;
  const completedExercises = activeWorkout?.completedExercises.filter(ex => ex.completed).length || 0;
  
  // Limit routines shown on dashboard
  const displayRoutines = routines.slice(0, 2);
  
  const handleStartRoutine = (routineId: number) => {
    startWorkout(routineId);
    navigate(`/routines/${routineId}`);
  };
  
  const handleCreateRoutine = () => {
    navigate("/routines/new");
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl mb-2">
          Welcome back, {user?.name || "Fitness Enthusiast"}!
        </h1>
        <p className="text-gray-600">Ready for your fitness journey today?</p>
      </div>
      
      {/* Age Filter Indicator */}
      <AgeIndicator />
      
      {/* Today's Workout */}
      {activeWorkout && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading font-semibold text-xl">Today's Workout</h2>
            <Button 
              variant="ghost" 
              className="text-primary text-sm font-medium"
              onClick={() => navigate("/routines")}
            >
              View all
            </Button>
          </div>
          
          <WorkoutCard 
            workout={activeWorkout}
            exercises={exercises}
            totalExercises={totalExercises}
            completedExercises={completedExercises}
          />
        </div>
      )}
      
      {/* Exercise Library Section */}
      <ExerciseList 
        exercises={exercises}
        title="Exercise Library"
      />
      
      {/* My Routines Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-heading font-semibold text-xl">My Routines</h2>
          <Button 
            className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
            onClick={handleCreateRoutine}
          >
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayRoutines.map((routine) => (
            <RoutineCard 
              key={routine.id} 
              routine={routine} 
              onStart={handleStartRoutine}
            />
          ))}
          
          {displayRoutines.length === 0 && (
            <div className="col-span-2 bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-3">You haven't created any routines yet.</p>
              <Button
                className="bg-primary text-white"
                onClick={handleCreateRoutine}
              >
                Create your first routine
              </Button>
            </div>
          )}
        </div>
        
        {routines.length > 2 && (
          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              className="text-primary font-medium"
              onClick={() => navigate("/routines")}
            >
              View all routines
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
