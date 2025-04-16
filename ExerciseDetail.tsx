import { useState } from "react";
import { Exercise } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Minus, Plus } from "lucide-react";
import WorkoutTimer from "@/components/workouts/WorkoutTimer";
import { useRoutines } from "@/hooks/useRoutines";
import { useToast } from "@/hooks/use-toast";

interface ExerciseDetailProps {
  exercise: Exercise;
  onClose: () => void;
  isOpen: boolean;
}

export default function ExerciseDetail({ exercise, onClose, isOpen }: ExerciseDetailProps) {
  const [showTimer, setShowTimer] = useState(false);
  const { addExerciseToRoutine } = useRoutines();
  const { toast } = useToast();

  const handleAddToRoutine = () => {
    addExerciseToRoutine(exercise.id);
    toast({
      title: "Exercise added",
      description: "Exercise has been added to your current routine."
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center">
            <DialogTitle className="font-semibold text-xl">{exercise.name}</DialogTitle>
          </DialogHeader>

          <div className="p-6">
            <div className="mb-6 space-y-4">
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {exercise.imageUrl ? (
                    <img 
                      src={exercise.imageUrl} 
                      alt={`${exercise.name} exercise`}
                      className="w-full h-64 object-cover rounded-lg"
                      loading="lazy"
                      decoding="async"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        const fallbackUrl = `https://placehold.co/800x600/e2e8f0/64748b?text=${encodeURIComponent(exercise.name)}`;
                        if (e.currentTarget.src !== fallbackUrl) {
                          e.currentTarget.src = fallbackUrl;
                        }
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <span className="text-4xl mb-2">🏋️</span>
                      <span>No image available</span>
                    </div>
                  )}
                </div>
                {exercise.videoUrl && (
                  <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <video
                      controls
                      playsInline
                      className="w-full h-full"
                      poster={exercise.imageUrl}
                      onError={(e) => {
                        const container = (e.target as HTMLVideoElement).parentElement;
                        if (container) {
                          container.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center text-gray-500">
                              <div class="text-center">
                                <div class="text-4xl mb-2">🎥</div>
                                <div>Video unavailable</div>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    >
                      <source src={exercise.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Target Area</div>
                <div className="font-medium">{exercise.muscleGroups}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Difficulty Level</div>
                <div className="font-medium">{exercise.difficulty}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Age Recommendation</div>
                <div className="font-medium">{exercise.ageRange}</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-gray-600 mb-3">{exercise.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Step-by-Step Instructions</h3>
              <div className="space-y-6">
                {exercise.instructions.map((instruction) => (
                  <div key={instruction.step} className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-medium">
                        {instruction.step}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{instruction.title}</h4>
                      <p className="text-gray-600 mb-2">{instruction.description}</p>
                      <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700">
                        <strong>Key Point:</strong> {instruction.keyPoint}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Modifications</h3>
              <div className="space-y-3">
                {exercise.modifications.map((mod, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className={`w-6 h-6 rounded-full ${mod.type === 'easier' ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
                        {mod.type === 'easier' ? (
                          <Minus className="text-secondary text-xs" />
                        ) : (
                          <Plus className="text-error text-xs" />
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{mod.type === 'easier' ? 'Easier: ' : 'Harder: '}{mod.name}</h4>
                      <p className="text-gray-600 text-sm">{mod.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
              <Button 
                className="bg-primary text-white py-3 px-6 rounded-lg font-medium flex-1"
                onClick={handleAddToRoutine}
              >
                Add to Routine
              </Button>
              <Button 
                variant="outline" 
                className="border border-primary text-primary py-3 px-6 rounded-lg font-medium flex-1"
                onClick={() => setShowTimer(true)}
              >
                Start Timer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showTimer && (
        <WorkoutTimer
          isOpen={showTimer}
          onClose={() => setShowTimer(false)}
          exerciseName={exercise.name}
        />
      )}
    </>
  );
}