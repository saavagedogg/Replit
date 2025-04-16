import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const onboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(8, "Age must be at least 8").max(100, "Age must be at most 100"),
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

interface OnboardingPageProps {
  onComplete: () => void;
}

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
      age: 30,
      username: "",
      password: ""
    }
  });
  
  const onSubmit = async (data: OnboardingValues) => {
    try {
      // Create a user account or save user data
      await apiRequest("POST", "/api/users", data);
      
      // For demo purposes, we'll just save to localStorage
      localStorage.setItem("fitlife_user", JSON.stringify({
        name: data.name,
        age: data.age,
        username: data.username,
        id: 1
      }));
      
      toast({
        title: "Welcome to FitLife!",
        description: "Your profile has been set up."
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-heading font-bold text-primary">
            Welcome to FitLife
          </CardTitle>
          <CardDescription>
            Let's personalize your fitness journey
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Tell us about yourself</h2>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What's your name?</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your name" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Choose a username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter a username" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Create a password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Enter a password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Age-appropriate exercises</h2>
                  <p className="text-gray-600 text-sm">
                    We'll use your age to recommend exercises that are suitable for you.
                  </p>
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How old are you?</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter your age" 
                            min={8}
                            max={100}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <div className="flex w-full flex-col gap-2">
                {step === 1 ? (
                  <Button 
                    type="button" 
                    className="w-full" 
                    onClick={() => {
                      let hasErrors = false;

                      // Validate name
                      if (form.getValues().name.length < 2) {
                        form.setError("name", {
                          type: "manual",
                          message: "Name must be at least 2 characters"
                        });
                        hasErrors = true;
                      }

                      // Validate username
                      if (form.getValues().username.length < 4) {
                        form.setError("username", {
                          type: "manual",
                          message: "Username must be at least 4 characters"
                        });
                        hasErrors = true;
                      }

                      // Validate password
                      if (form.getValues().password.length < 6) {
                        form.setError("password", {
                          type: "manual",
                          message: "Password must be at least 6 characters"
                        });
                        hasErrors = true;
                      }

                      if (hasErrors) return;
                      setStep(2);
                    }}
                  >
                    Continue
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    <Button type="submit" className="w-full">
                      Get Started
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                  </div>
                )}
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
