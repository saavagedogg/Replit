import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertExerciseSchema, insertRoutineSchema, insertWorkoutSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  
  // Users endpoints
  app.get("/api/users/current", async (req, res) => {
    try {
      // In a real app, would get user ID from session
      const userId = 1; // Placeholder
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only validate fields that are present
      const userData = req.body;
      const updatedUser = await storage.updateUser(userId, userData);
      
      // Don't return password
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Exercises endpoints
  app.get("/api/exercises", async (req, res) => {
    try {
      const exercises = await storage.getAllExercises();
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/exercises/:id", async (req, res) => {
    try {
      const exerciseId = parseInt(req.params.id);
      const exercise = await storage.getExercise(exerciseId);
      
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Routines endpoints
  app.get("/api/routines", async (req, res) => {
    try {
      // In a real app, would get user ID from session
      const userId = 1; // Placeholder
      const routines = await storage.getRoutinesByUser(userId);
      res.json(routines);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/routines", async (req, res) => {
    try {
      // In a real app, would get user ID from session
      const userId = 1; // Placeholder
      
      const routineData = {
        ...req.body,
        userId
      };
      
      const validatedData = insertRoutineSchema.parse(routineData);
      const routine = await storage.createRoutine(validatedData);
      
      res.status(201).json(routine);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid routine data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/routines/:id", async (req, res) => {
    try {
      const routineId = parseInt(req.params.id);
      const routine = await storage.getRoutine(routineId);
      
      if (!routine) {
        return res.status(404).json({ message: "Routine not found" });
      }
      
      // In a real app, would check if user owns this routine
      
      const updatedRoutine = await storage.updateRoutine(routineId, req.body);
      res.json(updatedRoutine);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid routine data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.delete("/api/routines/:id", async (req, res) => {
    try {
      const routineId = parseInt(req.params.id);
      const routine = await storage.getRoutine(routineId);
      
      if (!routine) {
        return res.status(404).json({ message: "Routine not found" });
      }
      
      // In a real app, would check if user owns this routine
      
      await storage.deleteRoutine(routineId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Workouts endpoints
  app.post("/api/workouts", async (req, res) => {
    try {
      // In a real app, would get user ID from session
      const userId = 1; // Placeholder
      
      const { routineId } = req.body;
      const routine = await storage.getRoutine(parseInt(routineId));
      
      if (!routine) {
        return res.status(404).json({ message: "Routine not found" });
      }
      
      const workoutData = {
        userId,
        routineId: parseInt(routineId),
        completedExercises: routine.exercises.map(ex => ({
          ...ex,
          completed: false
        })),
        duration: routine.duration,
        completed: false
      };
      
      const validatedData = insertWorkoutSchema.parse(workoutData);
      const workout = await storage.createWorkout(validatedData);
      
      res.status(201).json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid workout data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/workouts/:id", async (req, res) => {
    try {
      const workoutId = parseInt(req.params.id);
      const workout = await storage.getWorkout(workoutId);
      
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      // In a real app, would check if user owns this workout
      
      const updatedWorkout = await storage.updateWorkout(workoutId, req.body);
      
      // If workout is being marked as completed, update the routine's lastCompleted
      if (req.body.completed === true) {
        await storage.updateRoutine(updatedWorkout.routineId, {
          lastCompleted: new Date()
        });
      }
      
      res.json(updatedWorkout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid workout data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/workouts/:id/exercise/:exerciseId", async (req, res) => {
    try {
      const workoutId = parseInt(req.params.id);
      const exerciseId = parseInt(req.params.exerciseId);
      const workout = await storage.getWorkout(workoutId);
      
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      // In a real app, would check if user owns this workout
      
      const updatedWorkout = await storage.updateWorkoutExercise(workoutId, exerciseId, req.body);
      res.json(updatedWorkout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid exercise data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
