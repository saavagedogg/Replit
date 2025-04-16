import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useExercises } from "@/hooks/useExercises";
import ExerciseDetail from "@/components/exercises/ExerciseDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ExerciseDetails() {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { getExercise, isLoading } = useExercises();
  const [isOpen, setIsOpen] = useState(true);
  
  const exerciseId = parseInt(id || "0");
  const exercise = getExercise(exerciseId);
  
  // Handle closing the exercise detail
  const handleClose = () => {
    setIsOpen(false);
    navigate("/exercises");
  };
  
  // If no exercise found, navigate back to exercises
  useEffect(() => {
    if (!isLoading && !exercise) {
      navigate("/exercises");
    }
  }, [exercise, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  if (!exercise) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/exercises")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Exercises
        </Button>
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-700">Exercise not found</h2>
          <p className="text-gray-500 mt-2">The exercise you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/exercises")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Exercises
      </Button>
      
      <ExerciseDetail
        exercise={exercise}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </div>
  );
}
