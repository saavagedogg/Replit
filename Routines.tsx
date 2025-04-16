import { useState } from "react";
import { useRoutines } from "@/hooks/useRoutines";
import { useExercises } from "@/hooks/useExercises";
import RoutineCard from "@/components/workouts/RoutineCard";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Routines() {
  const { routines, createRoutine, startWorkout, deleteRoutine } = useRoutines();
  const { exercises } = useExercises();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState<number | null>(null);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [currentExercise, setCurrentExercise] = useState<number | null>(null);
  
  const handleStartRoutine = (routineId: number) => {
    startWorkout(routineId);
    toast({
      title: "Workout Started",
      description: "Your workout has been started. Good luck!"
    });
  };
  
  const handleAddExercise = () => {
    if (currentExercise && !selectedExercises.includes(currentExercise)) {
      setSelectedExercises([...selectedExercises, currentExercise]);
      setCurrentExercise(null);
    }
  };
  
  const handleRemoveExercise = (exerciseId: number) => {
    setSelectedExercises(selectedExercises.filter(id => id !== exerciseId));
  };
  
  const handleCreateRoutine = () => {
    if (!newRoutineName.trim()) {
      toast({
        title: "Routine name required",
        description: "Please provide a name for your routine",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedExercises.length === 0) {
      toast({
        title: "No exercises selected",
        description: "Please add at least one exercise to your routine",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate approximate duration (5 minutes per exercise)
    const duration = selectedExercises.length * 5 * 60;
    
    createRoutine({
      name: newRoutineName,
      exercises: selectedExercises.map(id => ({
        exerciseId: id,
        sets: 3,
        reps: 10,
        duration: null
      })),
      duration
    });
    
    setIsCreateDialogOpen(false);
    setNewRoutineName("");
    setSelectedExercises([]);
    setCurrentExercise(null);
    
    toast({
      title: "Routine Created",
      description: "Your new workout routine has been created successfully!"
    });
  };
  
  const confirmDeleteRoutine = (routineId: number) => {
    setRoutineToDelete(routineId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteRoutine = () => {
    if (routineToDelete !== null) {
      deleteRoutine(routineToDelete);
      setIsDeleteDialogOpen(false);
      setRoutineToDelete(null);
      
      toast({
        title: "Routine Deleted",
        description: "Your workout routine has been deleted."
      });
    }
  };
  
  const getExerciseName = (id: number) => {
    return exercises.find(e => e.id === id)?.name || `Exercise #${id}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading font-bold text-2xl">My Workout Routines</h1>
        <Button
          className="bg-primary text-white"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routines.map(routine => (
          <div key={routine.id} className="relative">
            <RoutineCard
              routine={routine}
              onStart={handleStartRoutine}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              onClick={() => confirmDeleteRoutine(routine.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {routines.length === 0 && (
          <div className="col-span-2 bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Workout Routines</h3>
            <p className="text-gray-500 mb-4">Create your first workout routine to get started on your fitness journey!</p>
            <Button
              className="bg-primary text-white"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Your First Routine
            </Button>
          </div>
        )}
      </div>
      
      {/* Create Routine Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workout Routine</DialogTitle>
            <DialogDescription>
              Add exercises to create a personalized workout routine.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Routine Name</Label>
              <Input
                id="name"
                placeholder="e.g. Morning Workout"
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Add Exercises</Label>
              <div className="flex space-x-2">
                <Select onValueChange={(value) => setCurrentExercise(Number(value))}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select an exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    {exercises
                      .filter(ex => !selectedExercises.includes(ex.id))
                      .map(exercise => (
                        <SelectItem key={exercise.id} value={exercise.id.toString()}>
                          {exercise.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={handleAddExercise}
                  disabled={!currentExercise}
                >
                  Add
                </Button>
              </div>
            </div>
            
            {selectedExercises.length > 0 && (
              <div className="border rounded-md p-3 space-y-2">
                <h4 className="font-medium">Selected Exercises</h4>
                <ul className="space-y-2">
                  {selectedExercises.map(exerciseId => (
                    <li key={exerciseId} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span>{getExerciseName(exerciseId)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-red-500"
                        onClick={() => handleRemoveExercise(exerciseId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRoutine}>
              Create Routine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Routine</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workout routine? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteRoutine}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
