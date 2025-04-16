import { useState, useEffect } from "react";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  // For demo purposes, also track these stats locally
  const [workoutsCompleted, setWorkoutsCompleted] = useState(15);
  const [workoutStreak, setWorkoutStreak] = useState(3);
  const [workoutsByCategory, setWorkoutsByCategory] = useState({
    upperBody: 8,
    lowerBody: 5,
    core: 6,
    cardio: 4
  });
  
  useEffect(() => {
    // Load user from localStorage for demonstration
    const loadUser = () => {
      const userJson = localStorage.getItem("fitlife_user");
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
    };
    
    loadUser();
    
    // In a real app, would fetch from API
    // fetchUser();
  }, []);
  
  const fetchUser = async () => {
    try {
      const response = await fetch("/api/users/current", { credentials: "include" });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
    }
  };
  
  const updateUser = async (userData: Partial<User>) => {
    // For demonstration, update in localStorage
    const userJson = localStorage.getItem("fitlife_user");
    if (userJson) {
      const currentUser = JSON.parse(userJson);
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem("fitlife_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
    
    // In a real app, would update via API
    /*
    try {
      await apiRequest("PATCH", "/api/users/current", userData);
      await fetchUser(); // Refetch user data
      return true;
    } catch (error) {
      console.error("Failed to update user", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
      return false;
    }
    */
    
    return true;
  };
  
  // Simulated function to track workout completion
  const completeWorkout = (categoryType: string) => {
    setWorkoutsCompleted(prev => prev + 1);
    setWorkoutStreak(prev => prev + 1);
    
    // Update category stats
    setWorkoutsByCategory(prev => {
      const updated = { ...prev };
      if (categoryType === "Upper Body") updated.upperBody += 1;
      if (categoryType === "Lower Body") updated.lowerBody += 1;
      if (categoryType === "Core") updated.core += 1;
      if (categoryType === "Cardio") updated.cardio += 1;
      return updated;
    });
  };
  
  return { 
    user, 
    updateUser, 
    workoutsCompleted, 
    workoutStreak, 
    workoutsByCategory,
    completeWorkout 
  };
}
