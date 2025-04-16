import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { UserCircle, Bell, LogOut, Save } from "lucide-react";

export default function Settings() {
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState(user?.age?.toString() || "");
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }
    
    const ageNumber = parseInt(age);
    if (isNaN(ageNumber) || ageNumber < 8 || ageNumber > 100) {
      toast({
        title: "Invalid age",
        description: "Please enter a valid age between 8 and 100",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    
    try {
      await updateUser({
        name,
        age: ageNumber
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleResetProgress = () => {
    // This would reset the user's progress
    toast({
      title: "Progress reset",
      description: "Your workout progress has been reset"
    });
  };
  
  const handleLogout = () => {
    // This would log the user out and redirect to login
    localStorage.removeItem("fitlife_user");
    window.location.reload();
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="font-heading font-bold text-2xl mb-6">Account Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCircle className="mr-2 h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Your age"
                min="8"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Your age helps us provide appropriate exercise recommendations
              </p>
            </div>
            
            <Button 
              className="w-full sm:w-auto" 
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </span>
              )}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="workout-reminders" className="block">Workout Reminders</Label>
                <p className="text-sm text-gray-500">Receive reminders for scheduled workouts</p>
              </div>
              <Switch
                id="workout-reminders"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="progress-updates" className="block">Progress Updates</Label>
                <p className="text-sm text-gray-500">Get notified about your fitness progress</p>
              </div>
              <Switch
                id="progress-updates"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-800">
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={handleResetProgress}
              >
                Reset Progress
              </Button>
              
              <Button
                variant="outline"
                className="text-gray-700"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
