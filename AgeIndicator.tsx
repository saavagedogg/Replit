import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AgeIndicator() {
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newAge, setNewAge] = useState(user?.age?.toString() || "");
  
  const handleUpdate = () => {
    const ageNumber = parseInt(newAge);
    if (isNaN(ageNumber) || ageNumber < 8 || ageNumber > 100) {
      toast({
        title: "Invalid age",
        description: "Please enter a valid age between 8 and 100",
        variant: "destructive"
      });
      return;
    }
    
    updateUser({ age: ageNumber });
    setIsOpen(false);
    toast({
      title: "Age updated",
      description: "Your exercise recommendations have been updated."
    });
  };
  
  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-medium">Personalized for your age group</h2>
          <p className="text-gray-500 text-sm">Age: {user?.age} years</p>
        </div>
        <Button 
          variant="ghost" 
          className="text-primary hover:text-primary-dark text-sm font-medium"
          onClick={() => setIsOpen(true)}
        >
          Change
        </Button>
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update your age</DialogTitle>
            <DialogDescription>
              This will personalize exercises and recommendations for your age group.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="age">Age</Label>
            <Input 
              id="age" 
              type="number" 
              value={newAge}
              onChange={(e) => setNewAge(e.target.value)}
              min="8"
              max="100"
              placeholder="Enter your age"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
