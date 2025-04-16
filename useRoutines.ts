import { useState, useEffect } from "react";
import { Routine, InsertRoutine, Workout, RoutineExercise } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useUser } from "./useUser";

type RoutineInput = Omit<InsertRoutine, "userId" | "lastCompleted">;

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  
  useEffect(() => {
    // Load routines for demonstration
    const mockRoutines: Routine[] = [
      {
        id: 1,
        userId: 1,
        name: "Monday Morning Routine",
        exercises: [
          { exerciseId: 1, sets: 3, reps: 10, duration: null },
          { exerciseId: 2, sets: 3, reps: 15, duration: null },
          { exerciseId: 3, sets: 2, reps: null, duration: 60 },
          { exerciseId: 4, sets: 3, reps: 12, duration: null }
        ],
        duration: 30 * 60, // 30 minutes
        lastCompleted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
      },
      {
        id: 2,
        userId: 1,
        name: "Weekend Full Body",
        exercises: [
          { exerciseId: 1, sets: 3, reps: 10, duration: null },
          { exerciseId: 2, sets: 3, reps: 15, duration: null },
          { exerciseId: 3, sets: 2, reps: null, duration: 60 },
          { exerciseId: 5, sets: 3, reps: 12, duration: null },
          { exerciseId: 6, sets: 2, reps: null, duration: 45 },
          { exerciseId: 7, sets: 3, reps: 10, duration: null }
        ],
        duration: 45 * 60, // 45 minutes
        lastCompleted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
      },
      {
        id: 3,
        userId: 1,
        name: "Quick Morning Cardio",
        exercises: [
          { exerciseId: 6, sets: 3, reps: null, duration: 60 }, // Mountain Climbers
          { exerciseId: 2, sets: 3, reps: null, duration: 60 }, // Jumping Jacks
          { exerciseId: 3, sets: 2, reps: null, duration: 30 }  // Bicycle Crunches
        ],
        duration: 15 * 60, // 15 minutes
        lastCompleted: null,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
      },
      {
        id: 4,
        userId: 1,
        name: "Core Strength Builder",
        exercises: [
          { exerciseId: 5, sets: 3, reps: null, duration: 30 }, // Plank
          { exerciseId: 3, sets: 3, reps: 15, duration: null }, // Bicycle Crunches
          { exerciseId: 6, sets: 3, reps: 20, duration: null }, // Mountain Climbers
          { exerciseId: 5, sets: 2, reps: null, duration: 45 }  // Plank (longer hold)
        ],
        duration: 20 * 60, // 20 minutes
        lastCompleted: null,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
      },
      {
        id: 5,
        userId: 1,
        name: "Lower Body Focus",
        exercises: [
          { exerciseId: 4, sets: 3, reps: null, duration: 30 }, // Wall Sit
          { exerciseId: 2, sets: 1, reps: null, duration: 60 }, // Jumping Jacks (warm-up)
          { exerciseId: 1, sets: 3, reps: 12, duration: null }, // Push-ups
          { exerciseId: 4, sets: 2, reps: null, duration: 45 }  // Wall Sit (longer)
        ],
        duration: 25 * 60, // 25 minutes
        lastCompleted: null,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      },
      {
        id: 6,
        userId: 1,
        name: "Upper Body Strength",
        exercises: [
          { exerciseId: 1, sets: 3, reps: 10, duration: null }, // Push-ups
          { exerciseId: 3, sets: 3, reps: 12, duration: null }, // Dumbbell Rows
          { exerciseId: 1, sets: 2, reps: 8, duration: null },  // Push-ups (fewer reps)
          { exerciseId: 5, sets: 2, reps: null, duration: 30 }  // Plank
        ],
        duration: 30 * 60, // 30 minutes
        lastCompleted: null,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() // 12 days ago
      }
    ];
    
    const mockWorkout: Workout = {
      id: 1,
      userId: 1,
      routineId: 1,
      completedExercises: [
        { exerciseId: 1, sets: 3, reps: 10, duration: null, completed: true },
        { exerciseId: 2, sets: 3, reps: 15, duration: null, completed: true },
        { exerciseId: 3, sets: 2, reps: null, duration: 60, completed: false },
        { exerciseId: 4, sets: 3, reps: 12, duration: null, completed: false }
      ],
      duration: 30 * 60, // 30 minutes
      completed: false,
      completedAt: new Date().toISOString()
    };
    
    setRoutines(mockRoutines);
    setActiveWorkout(mockWorkout);
    setIsLoading(false);
    
    // In a real app, would fetch from API
    // fetchRoutines();
  }, []);
  
  const fetchRoutines = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/routines", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setRoutines(data);
      }
    } catch (error) {
      console.error("Failed to fetch routines", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const createRoutine = async (routineData: RoutineInput) => {
    // For demonstration purposes
    const newRoutine: Routine = {
      id: routines.length + 1,
      userId: user?.id || 1,
      name: routineData.name,
      exercises: routineData.exercises,
      duration: routineData.duration,
      lastCompleted: null,
      createdAt: new Date().toISOString()
    };
    
    setRoutines([...routines, newRoutine]);
    
    // In a real app, would create via API
    /*
    try {
      await apiRequest("POST", "/api/routines", {
        name: routineData.name,
        exercises: routineData.exercises,
        duration: routineData.duration
      });
      await fetchRoutines();
    } catch (error) {
      console.error("Failed to create routine", error);
      throw error;
    }
    */
  };
  
  const deleteRoutine = async (routineId: number) => {
    // For demonstration purposes
    setRoutines(routines.filter(r => r.id !== routineId));
    
    // In a real app, would delete via API
    /*
    try {
      await apiRequest("DELETE", `/api/routines/${routineId}`, undefined);
      await fetchRoutines();
    } catch (error) {
      console.error("Failed to delete routine", error);
      throw error;
    }
    */
  };
  
  const startWorkout = async (routineId: number) => {
    // For demonstration purposes
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;
    
    const newWorkout: Workout = {
      id: Math.floor(Math.random() * 1000),
      userId: user?.id || 1,
      routineId: routineId,
      completedExercises: routine.exercises.map(ex => ({
        ...ex,
        completed: false
      })),
      duration: routine.duration,
      completed: false,
      completedAt: new Date().toISOString()
    };
    
    setActiveWorkout(newWorkout);
    
    // In a real app, would create via API
    /*
    try {
      const response = await apiRequest("POST", `/api/workouts`, {
        routineId
      });
      const data = await response.json();
      setActiveWorkout(data);
    } catch (error) {
      console.error("Failed to start workout", error);
      throw error;
    }
    */
  };
  
  const completeExercise = async (exerciseId: number) => {
    if (!activeWorkout) return;
    
    // Update locally for demonstration
    const updatedWorkout = {
      ...activeWorkout,
      completedExercises: activeWorkout.completedExercises.map(ex => 
        ex.exerciseId === exerciseId ? { ...ex, completed: true } : ex
      )
    };
    
    setActiveWorkout(updatedWorkout);
    
    // Check if all exercises are completed
    const allCompleted = updatedWorkout.completedExercises.every(ex => ex.completed);
    if (allCompleted) {
      completeWorkout();
    }
    
    // In a real app, would update via API
    /*
    try {
      await apiRequest("PATCH", `/api/workouts/${activeWorkout.id}/exercise/${exerciseId}`, {
        completed: true
      });
    } catch (error) {
      console.error("Failed to complete exercise", error);
      throw error;
    }
    */
  };
  
  const completeWorkout = async () => {
    if (!activeWorkout) return;
    
    // Update locally for demonstration
    const completedWorkout = {
      ...activeWorkout,
      completed: true
    };
    
    // Update the lastCompleted date on the routine
    const updatedRoutines = routines.map(routine => 
      routine.id === activeWorkout.routineId 
        ? { ...routine, lastCompleted: new Date().toISOString() } 
        : routine
    );
    
    setRoutines(updatedRoutines);
    setActiveWorkout(completedWorkout);
    
    // In a real app, would update via API
    /*
    try {
      await apiRequest("PATCH", `/api/workouts/${activeWorkout.id}`, {
        completed: true
      });
      await fetchRoutines(); // Refresh routines to get updated lastCompleted
    } catch (error) {
      console.error("Failed to complete workout", error);
      throw error;
    }
    */
  };
  
  const addExerciseToRoutine = (exerciseId: number) => {
    // This would be part of a routine creation flow
    console.log(`Added exercise ${exerciseId} to current routine creation`);
    // In a real app, this would update a form state or make an API call
  };
  
  return {
    routines,
    activeWorkout,
    isLoading,
    createRoutine,
    deleteRoutine,
    startWorkout,
    completeExercise,
    completeWorkout,
    addExerciseToRoutine
  };
}
