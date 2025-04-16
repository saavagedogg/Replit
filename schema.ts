import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for storing user information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  age: integer("age").notNull(),
  name: text("name").notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  age: true,
  name: true
});

// Exercise schema for storing exercise information
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  instructions: json("instructions").$type<ExerciseInstruction[]>().notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  ageRange: text("age_range").notNull(),
  muscleGroups: text("muscle_groups").notNull(),
  modifications: json("modifications").$type<ExerciseModification[]>().notNull()
});

export const insertExerciseSchema = createInsertSchema(exercises).pick({
  name: true,
  description: true,
  imageUrl: true,
  instructions: true,
  category: true,
  difficulty: true,
  ageRange: true,
  muscleGroups: true,
  modifications: true
});

// Routines schema for storing workout routines
export const routines = pgTable("routines", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  exercises: json("exercises").$type<RoutineExercise[]>().notNull(),
  duration: integer("duration").notNull(),
  lastCompleted: timestamp("last_completed"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const insertRoutineSchema = createInsertSchema(routines).pick({
  userId: true,
  name: true,
  exercises: true,
  duration: true,
  lastCompleted: true
});

// Workout schema for tracking completed workouts
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  routineId: integer("routine_id").notNull(),
  completedExercises: json("completed_exercises").$type<CompletedExercise[]>().notNull(),
  duration: integer("duration").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at").notNull().defaultNow()
});

export const insertWorkoutSchema = createInsertSchema(workouts).pick({
  userId: true,
  routineId: true,
  completedExercises: true,
  duration: true,
  completed: true
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Exercise = typeof exercises.$inferSelect & {
  videoUrl?: string;
};
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

export type Routine = typeof routines.$inferSelect;
export type InsertRoutine = z.infer<typeof insertRoutineSchema>;

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;

// Additional types
export type ExerciseInstruction = {
  step: number;
  title: string;
  description: string;
  keyPoint: string;
};

export type ExerciseModification = {
  type: "easier" | "harder";
  name: string;
  description: string;
};

export type RoutineExercise = {
  exerciseId: number;
  sets: number;
  reps: number | null;
  duration: number | null;
};

export type CompletedExercise = {
  exerciseId: number;
  sets: number;
  reps: number | null;
  duration: number | null;
  completed: boolean;
};
