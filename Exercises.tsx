import { useState } from "react";
import { useExercises } from "@/hooks/useExercises";
import ExerciseList from "@/components/exercises/ExerciseList";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Exercises() {
  const { exercises, isLoading } = useExercises();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter exercises based on search query
  const filteredExercises = exercises.filter(exercise => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      exercise.name.toLowerCase().includes(query) ||
      exercise.description.toLowerCase().includes(query) ||
      exercise.category.toLowerCase().includes(query) ||
      exercise.difficulty.toLowerCase().includes(query) ||
      exercise.muscleGroups.toLowerCase().includes(query)
    );
  });
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl mb-4">Exercise Library</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search exercises..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <ExerciseList 
          exercises={filteredExercises} 
          title={searchQuery ? `Search Results: ${filteredExercises.length}` : "All Exercises"}
        />
      )}
    </div>
  );
}
