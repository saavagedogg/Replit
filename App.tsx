import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Exercises from "@/pages/Exercises";
import ExerciseDetails from "@/pages/ExerciseDetails";
import Routines from "@/pages/Routines";
import Progress from "@/pages/Progress";
import Settings from "@/pages/Settings";
import OnboardingPage from "@/pages/OnboardingPage";
import AppLayout from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import Nutrition from "./pages/Nutrition"; // Added import for Nutrition page

function Router() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const userJson = localStorage.getItem("fitlife_user");
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user && user.age) {
          setIsOnboarded(true);
        }
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return null;
  }

  if (!isOnboarded) {
    return <OnboardingPage onComplete={() => setIsOnboarded(true)} />;
  }

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/exercises" component={Exercises} />
        <Route path="/exercises/:id" component={ExerciseDetails} />
        <Route path="/routines" component={Routines} />
        <Route path="/progress" component={Progress} />
        <Route path="/settings" component={Settings} />
        <Route path="/nutrition" component={Nutrition} /> {/* Added Nutrition route */}
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;