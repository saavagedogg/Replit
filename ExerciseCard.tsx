import { Exercise } from "@shared/schema";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExerciseCardProps {
  exercise: Exercise;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [_, navigate] = useLocation();

  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          {/* Display exercise image - in production this would be from a real source */}
          <img 
            src={exercise.imageUrl} 
            alt={`${exercise.name} exercise`} 
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-indigo-100 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
            {exercise.ageRange}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-1">{exercise.name}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span>{exercise.category}</span>
          <span className="mx-2">•</span>
          <span>{exercise.difficulty}</span>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {exercise.description}
        </p>
        <Button 
          variant="link" 
          className="text-primary text-sm font-medium p-0 h-auto"
          onClick={() => navigate(`/exercises/${exercise.id}`)}
        >
          View details
        </Button>
      </CardContent>
    </Card>
  );
}
