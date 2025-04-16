import { useState } from "react";
import { Exercise } from "@shared/schema";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import ExerciseCard from "./ExerciseCard";
import ExerciseDetail from "./ExerciseDetail";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ExerciseListProps {
  exercises: Exercise[];
  title?: string;
}

type CategoryFilter = 'All' | 'Upper Body' | 'Lower Body' | 'Core' | 'Cardio';
const CATEGORIES: CategoryFilter[] = ['All', 'Upper Body', 'Lower Body', 'Core', 'Cardio'];

export default function ExerciseList({ exercises, title = "Exercise Library" }: ExerciseListProps) {
  const { user } = useUser();
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [limit, setLimit] = useState(6);
  
  // Filter exercises by age appropriateness and category
  const filteredExercises = exercises.filter(exercise => {
    // Age filter
    const ageRange = exercise.ageRange;
    const userAge = user?.age || 30;
    
    let ageMatch = false;
    if (ageRange === "All Ages") {
      ageMatch = true;
    } else if (ageRange.includes("-")) {
      const match = ageRange.match(/Age (\d+)-(\d+)/);
      if (match) {
        const min = parseInt(match[1]);
        const max = parseInt(match[2]);
        ageMatch = userAge >= min && userAge <= max;
      }
    }
    
    // Category filter
    const categoryMatch = category === 'All' || exercise.category === category;
    
    return ageMatch && categoryMatch;
  });
  
  // Get limited exercises for display
  const displayExercises = filteredExercises.slice(0, limit);
  
  const loadMore = () => {
    setLimit(prev => prev + 6);
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading font-semibold text-xl">{title}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-primary text-sm font-medium">
              <span>Filter</span>
              <ChevronDown className="ml-1 text-xs" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Additional filters could be added here */}
            <DropdownMenuItem>By Difficulty</DropdownMenuItem>
            <DropdownMenuItem>By Duration</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex space-x-3 overflow-x-auto pb-2 mb-4">
        {CATEGORIES.map((cat) => (
          <Button 
            key={cat}
            variant={category === cat ? "default" : "outline"}
            className={`flex-shrink-0 ${
              category === cat 
                ? "bg-primary text-white" 
                : "bg-white text-gray-700 border border-gray-200"
            } px-4 py-2 rounded-full text-sm font-medium`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayExercises.map(exercise => (
          <div key={exercise.id} onClick={() => setSelectedExercise(exercise)}>
            <ExerciseCard exercise={exercise} />
          </div>
        ))}
      </div>
      
      {limit < filteredExercises.length && (
        <div className="mt-4 text-center">
          <Button 
            variant="ghost" 
            onClick={loadMore}
            className="inline-flex items-center justify-center text-primary font-medium"
          >
            Load more exercises
            <ChevronDown className="ml-1 text-xs" />
          </Button>
        </div>
      )}
      
      {selectedExercise && (
        <ExerciseDetail 
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
}
