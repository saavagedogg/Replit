import { useState, useEffect } from "react";
import { Exercise } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch exercises from the API
    fetchExercises();
  }, []);
  
  const fetchExercises = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/exercises", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        console.log("Exercises fetched:", data.length, data);
        setExercises(data);
      } else {
        console.error("Failed to fetch exercises, status:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch exercises", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getExercise = (id: number) => {
    return exercises.find(exercise => exercise.id === id);
  };
  
  const getExercisesByCategory = (category: string) => {
    return exercises.filter(exercise => exercise.category === category);
  };
  
  const getExercisesByAgeRange = (age: number) => {
    return exercises.filter(exercise => {
      if (exercise.ageRange === "All Ages") return true;
      
      if (exercise.ageRange.includes("-")) {
        const [min, max] = exercise.ageRange.replace("Age ", "").split("-").map(Number);
        return age >= min && age <= max;
      }
      
      return false;
    });
  };
  
  return {
    exercises,
    isLoading,
    getExercise,
    getExercisesByCategory,
    getExercisesByAgeRange
  };
}
