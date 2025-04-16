import { users, type User, type InsertUser, exercises, type Exercise, type InsertExercise, routines, type Routine, type InsertRoutine, workouts, type Workout, type InsertWorkout, type CompletedExercise } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;

  // Exercise methods
  getExercise(id: number): Promise<Exercise | undefined>;
  getAllExercises(): Promise<Exercise[]>;
  getExercisesByCategory(category: string): Promise<Exercise[]>;
  getExercisesByAgeRange(minAge: number, maxAge: number): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;

  // Routine methods
  getRoutine(id: number): Promise<Routine | undefined>;
  getRoutinesByUser(userId: number): Promise<Routine[]>;
  createRoutine(routine: InsertRoutine): Promise<Routine>;
  updateRoutine(id: number, routineData: Partial<Routine>): Promise<Routine>;
  deleteRoutine(id: number): Promise<void>;

  // Workout methods
  getWorkout(id: number): Promise<Workout | undefined>;
  getWorkoutsByUser(userId: number): Promise<Workout[]>;
  getActiveWorkoutByUser(userId: number): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: number, workoutData: Partial<Workout>): Promise<Workout>;
  updateWorkoutExercise(workoutId: number, exerciseId: number, exerciseData: Partial<CompletedExercise>): Promise<Workout>;
  completeWorkout(id: number): Promise<Workout>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private exercises: Map<number, Exercise>;
  private routines: Map<number, Routine>;
  private workouts: Map<number, Workout>;
  
  private userIdCounter: number;
  private exerciseIdCounter: number;
  private routineIdCounter: number;
  private workoutIdCounter: number;

  constructor() {
    this.users = new Map();
    this.exercises = new Map();
    this.routines = new Map();
    this.workouts = new Map();
    
    this.userIdCounter = 1;
    this.exerciseIdCounter = 1;
    this.routineIdCounter = 1;
    this.workoutIdCounter = 1;
    
    // Initialize with some sample exercises
    this.initializeExercises();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Exercise methods
  async getExercise(id: number): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async getAllExercises(): Promise<Exercise[]> {
    const exercises = Array.from(this.exercises.values());
    console.log(`Returning ${exercises.length} exercises`);
    return exercises;
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(
      (exercise) => exercise.category === category
    );
  }

  async getExercisesByAgeRange(minAge: number, maxAge: number): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(exercise => {
      if (exercise.ageRange === "All Ages") return true;
      
      const match = exercise.ageRange.match(/Age (\d+)-(\d+)/);
      if (match) {
        const [_, min, max] = match;
        const ageMin = parseInt(min);
        const ageMax = parseInt(max);
        
        // Check if the provided age range overlaps with the exercise age range
        return (minAge <= ageMax && maxAge >= ageMin);
      }
      
      return false;
    });
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const id = this.exerciseIdCounter++;
    const newExercise: Exercise = { ...exercise, id };
    this.exercises.set(id, newExercise);
    return newExercise;
  }

  // Routine methods
  async getRoutine(id: number): Promise<Routine | undefined> {
    return this.routines.get(id);
  }

  async getRoutinesByUser(userId: number): Promise<Routine[]> {
    return Array.from(this.routines.values()).filter(
      (routine) => routine.userId === userId
    );
  }

  async createRoutine(routine: InsertRoutine): Promise<Routine> {
    const id = this.routineIdCounter++;
    const now = new Date();
    const newRoutine: Routine = { 
      ...routine,
      id,
      createdAt: now.toISOString()
    };
    this.routines.set(id, newRoutine);
    return newRoutine;
  }

  async updateRoutine(id: number, routineData: Partial<Routine>): Promise<Routine> {
    const routine = await this.getRoutine(id);
    if (!routine) {
      throw new Error(`Routine with ID ${id} not found`);
    }
    
    const updatedRoutine = { ...routine, ...routineData };
    this.routines.set(id, updatedRoutine);
    return updatedRoutine;
  }

  async deleteRoutine(id: number): Promise<void> {
    if (!this.routines.has(id)) {
      throw new Error(`Routine with ID ${id} not found`);
    }
    
    this.routines.delete(id);
  }

  // Workout methods
  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async getWorkoutsByUser(userId: number): Promise<Workout[]> {
    return Array.from(this.workouts.values()).filter(
      (workout) => workout.userId === userId
    );
  }

  async getActiveWorkoutByUser(userId: number): Promise<Workout | undefined> {
    return Array.from(this.workouts.values()).find(
      (workout) => workout.userId === userId && !workout.completed
    );
  }

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const id = this.workoutIdCounter++;
    const now = new Date();
    const newWorkout: Workout = { 
      ...workout,
      id,
      completedAt: now.toISOString()
    };
    this.workouts.set(id, newWorkout);
    return newWorkout;
  }

  async updateWorkout(id: number, workoutData: Partial<Workout>): Promise<Workout> {
    const workout = await this.getWorkout(id);
    if (!workout) {
      throw new Error(`Workout with ID ${id} not found`);
    }
    
    const updatedWorkout = { ...workout, ...workoutData };
    this.workouts.set(id, updatedWorkout);
    return updatedWorkout;
  }

  async updateWorkoutExercise(workoutId: number, exerciseId: number, exerciseData: Partial<CompletedExercise>): Promise<Workout> {
    const workout = await this.getWorkout(workoutId);
    if (!workout) {
      throw new Error(`Workout with ID ${workoutId} not found`);
    }
    
    const updatedExercises = workout.completedExercises.map(ex => 
      ex.exerciseId === exerciseId ? { ...ex, ...exerciseData } : ex
    );
    
    const updatedWorkout = { 
      ...workout, 
      completedExercises: updatedExercises 
    };
    
    this.workouts.set(workoutId, updatedWorkout);
    return updatedWorkout;
  }

  async completeWorkout(id: number): Promise<Workout> {
    const workout = await this.getWorkout(id);
    if (!workout) {
      throw new Error(`Workout with ID ${id} not found`);
    }
    
    const completedExercises = workout.completedExercises.map(ex => ({
      ...ex,
      completed: true
    }));
    
    const now = new Date();
    const updatedWorkout = { 
      ...workout, 
      completed: true,
      completedExercises,
      completedAt: now.toISOString()
    };
    
    this.workouts.set(id, updatedWorkout);
    
    // Also update the routine's lastCompleted date
    const routine = await this.getRoutine(workout.routineId);
    if (routine) {
      await this.updateRoutine(workout.routineId, {
        lastCompleted: now.toISOString()
      });
    }
    
    return updatedWorkout;
  }

  // Initialize with some demo exercises
  private async initializeExercises() {
    // This method pre-populates the storage with some exercise data
    // In a real application, this would be done through an API or database seed
    const sampleExercises = [
      {
        name: "Push-ups",
        description: "A classic exercise that targets your chest, shoulders, and triceps.",
        imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://storage.googleapis.com/webfitness-content/exercises/push-ups-demo.mp4",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Begin in a plank position with your hands slightly wider than shoulder-width apart, fingers pointing forward. Your body should form a straight line from head to heels.",
            keyPoint: "Keep your core engaged and avoid sagging your hips or arching your back."
          },
          {
            step: 2,
            title: "Lowering Phase",
            description: "Begin bending your elbows to lower your body towards the floor. Keep your elbows at about a 45-degree angle to your body, not flared out to the sides.",
            keyPoint: "Lower until your chest is about an inch from the ground."
          },
          {
            step: 3,
            title: "Pushing Phase",
            description: "Push through your palms to straighten your arms and return to the starting position. Fully extend your arms without locking your elbows.",
            keyPoint: "Exhale as you push up and maintain that straight line from head to heels."
          }
        ],
        category: "Upper Body",
        difficulty: "Beginner",
        ageRange: "Age 30-45",
        muscleGroups: "Chest, Shoulders, Triceps",
        modifications: [
          {
            type: "easier",
            name: "Knee Push-ups",
            description: "Perform with knees on the ground to reduce the weight you're pushing."
          },
          {
            type: "harder",
            name: "Decline Push-ups",
            description: "Place your feet on an elevated surface to increase the challenge."
          }
        ]
      },
      {
        name: "Squats",
        description: "Build leg strength with this fundamental exercise targeting quads and glutes.",
        imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Stand with feet slightly wider than hip-width apart, toes pointing slightly outward. Keep your chest up and shoulders back.",
            keyPoint: "Distribute your weight evenly through your feet."
          },
          {
            step: 2,
            title: "Descending Phase",
            description: "Initiate the movement by hinging at the hips, then bend your knees to lower your body. Keep your back straight and chest up throughout the movement.",
            keyPoint: "Aim to lower until your thighs are parallel to the ground, or as low as you can with proper form."
          },
          {
            step: 3,
            title: "Rising Phase",
            description: "Push through your heels to stand back up to the starting position, fully extending your hips and knees at the top.",
            keyPoint: "Keep your knees tracking over (not collapsing inward) your toes as you rise."
          }
        ],
        category: "Lower Body",
        difficulty: "Intermediate",
        ageRange: "Age 30-45",
        muscleGroups: "Quadriceps, Glutes, Hamstrings",
        modifications: [
          {
            type: "easier",
            name: "Box Squats",
            description: "Squat down to sit on a box or chair, then stand back up."
          },
          {
            type: "harder",
            name: "Weighted Squats",
            description: "Hold dumbbells or a kettlebell to increase resistance."
          }
        ]
      },
      {
        name: "Plank",
        description: "Strengthen your core and improve stability with this isometric exercise.",
        imageUrl: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Start in a face-down position. Place your forearms on the ground with elbows directly beneath your shoulders.",
            keyPoint: "Your forearms should be parallel to each other and pointing forward."
          },
          {
            step: 2,
            title: "Proper Form",
            description: "Lift your body so that you're balancing on your forearms and toes. Your body should form a straight line from head to heels.",
            keyPoint: "Engage your core by pulling your belly button toward your spine."
          },
          {
            step: 3,
            title: "Hold",
            description: "Hold this position while breathing normally. Start with 20-30 seconds and gradually increase your time.",
            keyPoint: "Don't let your hips sag down or pike up; maintain that straight body line."
          }
        ],
        category: "Core",
        difficulty: "All Levels",
        ageRange: "All Ages",
        muscleGroups: "Abs, Lower Back, Shoulders",
        modifications: [
          {
            type: "easier",
            name: "Knee Plank",
            description: "Perform the plank with knees on the ground instead of toes."
          },
          {
            type: "harder",
            name: "Side Plank",
            description: "Rotate to one side, balancing on one forearm and the side of your foot."
          }
        ]
      },
      {
        name: "Lunges",
        description: "Improve lower body strength, balance, and flexibility with lunges.",
        imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Stand with feet hip-width apart, hands on hips or at your sides.",
            keyPoint: "Keep your posture tall with shoulders back and chest up."
          },
          {
            step: 2,
            title: "Stepping Forward",
            description: "Take a step forward with one foot, landing heel first, then toe.",
            keyPoint: "Make sure your step is long enough so that when you lower, your knee doesn't extend beyond your toes."
          },
          {
            step: 3,
            title: "Lowering",
            description: "Lower your body by bending both knees to about 90 degrees. Your front knee should be directly above your ankle, and your back knee hovering just above the floor.",
            keyPoint: "Keep your upper body straight and core engaged throughout the movement."
          },
          {
            step: 4,
            title: "Rising and Repeating",
            description: "Push through the heel of your front foot to return to the starting position. Repeat with the opposite leg.",
            keyPoint: "Maintain balance by engaging your core and keeping your gaze forward."
          }
        ],
        category: "Lower Body",
        difficulty: "Intermediate",
        ageRange: "Age 20-60",
        muscleGroups: "Quadriceps, Glutes, Hamstrings, Calves",
        modifications: [
          {
            type: "easier",
            name: "Stationary Lunges",
            description: "Perform lunges without moving forward, staying in place."
          },
          {
            type: "harder",
            name: "Walking Lunges",
            description: "Continue moving forward with each lunge step."
          }
        ]
      },
      {
        name: "Mountain Climbers",
        description: "A dynamic exercise that combines core strength with cardiovascular benefits.",
        imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Begin in a plank position with your hands directly under your shoulders, arms straight, and body forming a straight line from head to heels.",
            keyPoint: "Your hands should be shoulder-width apart with fingers pointing forward."
          },
          {
            step: 2,
            title: "Knee Drive",
            description: "Drive one knee toward your chest, keeping your foot off the ground.",
            keyPoint: "Keep your hips down and core engaged during the movement."
          },
          {
            step: 3,
            title: "Alternate Legs",
            description: "Quickly switch legs, extending the bent leg back to plank position while bringing the other knee toward your chest.",
            keyPoint: "Maintain a rhythmic pace, like running in place in a plank position."
          }
        ],
        category: "Cardio",
        difficulty: "Intermediate",
        ageRange: "Age 15-50",
        muscleGroups: "Core, Shoulders, Hip Flexors",
        modifications: [
          {
            type: "easier",
            name: "Slow Mountain Climbers",
            description: "Perform the exercise at a slower pace with more control."
          },
          {
            type: "harder",
            name: "Cross-Body Mountain Climbers",
            description: "Bring your knee toward the opposite elbow to engage obliques more."
          }
        ]
      },
      {
        name: "Bicycle Crunches",
        description: "An effective core exercise targeting multiple abdominal muscles.",
        imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Lie on your back with your hands behind your head, elbows out to the sides. Lift your shoulders off the ground and bring your knees up to a 90-degree angle.",
            keyPoint: "Keep your lower back pressed into the floor throughout the exercise."
          },
          {
            step: 2,
            title: "Rotation",
            description: "Simultaneously rotate your upper body to one side while extending the opposite leg straight out, bringing your elbow towards the opposite knee.",
            keyPoint: "Focus on the rotation coming from your core, not just your arms."
          },
          {
            step: 3,
            title: "Alternate Sides",
            description: "In a continuous motion, alternate sides as if pedaling a bicycle, bringing each elbow to the opposite knee.",
            keyPoint: "Maintain control throughout the movement rather than rushing through repetitions."
          }
        ],
        category: "Core",
        difficulty: "Intermediate",
        ageRange: "Age 15-65",
        muscleGroups: "Rectus Abdominis, Obliques",
        modifications: [
          {
            type: "easier",
            name: "Seated Bicycle Crunches",
            description: "Perform in a seated position, lifting feet off the ground slightly."
          },
          {
            type: "harder",
            name: "Slow Bicycle Crunches",
            description: "Perform each rotation with a 3-second hold at the contracted position."
          }
        ]
      },
      {
        name: "Jumping Jacks",
        description: "A cardiovascular exercise that improves coordination and increases heart rate.",
        imageUrl: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Stand upright with your feet together and arms by your sides.",
            keyPoint: "Maintain good posture with your back straight and shoulders relaxed."
          },
          {
            step: 2,
            title: "Jumping Out",
            description: "Jump to spread your feet wider than hip-width apart while simultaneously raising your arms above your head.",
            keyPoint: "The movement should be fluid and controlled, not jerky."
          },
          {
            step: 3,
            title: "Jumping In",
            description: "Jump to bring your feet back together while lowering your arms back to your sides.",
            keyPoint: "Land softly by using your leg muscles to absorb the impact."
          }
        ],
        category: "Cardio",
        difficulty: "Beginner",
        ageRange: "Age 8-80",
        muscleGroups: "Full Body",
        modifications: [
          {
            type: "easier",
            name: "Half Jacks",
            description: "Only raise your arms to shoulder height or only do the leg movements."
          },
          {
            type: "harder",
            name: "Weighted Jumping Jacks",
            description: "Hold light dumbbells while performing the exercise to increase intensity."
          }
        ]
      },
      {
        name: "Dumbbell Rows",
        description: "An effective back exercise that strengthens the upper and middle back muscles.",
        imageUrl: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Stand with feet shoulder-width apart, holding a dumbbell in one hand. Hinge at your hips and bend your knees slightly. Place your free hand on something stable for support.",
            keyPoint: "Keep your back flat and parallel to the floor."
          },
          {
            step: 2,
            title: "Pulling Motion",
            description: "Pull the dumbbell up toward your hip, keeping your elbow close to your body.",
            keyPoint: "Squeeze your shoulder blade as you lift the weight."
          },
          {
            step: 3,
            title: "Lowering Phase",
            description: "Lower the dumbbell back to the starting position in a controlled manner.",
            keyPoint: "Maintain a straight back throughout the entire movement."
          }
        ],
        category: "Upper Body",
        difficulty: "Intermediate",
        ageRange: "Age 16-70",
        muscleGroups: "Latissimus Dorsi, Rhomboids, Biceps",
        modifications: [
          {
            type: "easier",
            name: "Seated Rows",
            description: "Perform the exercise seated with support for your back."
          },
          {
            type: "harder",
            name: "Heavy Dumbbell Rows",
            description: "Increase the weight or add a pause at the top of the movement."
          }
        ]
      },
      {
        name: "Wall Sit",
        description: "A static exercise that builds endurance in the quadriceps, hamstrings, and glutes.",
        imageUrl: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Stand with your back against a wall and feet shoulder-width apart, about 2 feet away from the wall.",
            keyPoint: "Make sure the wall can fully support your weight."
          },
          {
            step: 2,
            title: "Sliding Down",
            description: "Slowly slide your back down the wall until your thighs are parallel to the ground, forming a 90-degree angle at your knees.",
            keyPoint: "Keep your back flat against the wall throughout the movement."
          },
          {
            step: 3,
            title: "Hold Position",
            description: "Hold this sitting position for the prescribed time, keeping your core engaged.",
            keyPoint: "Breathe normally and avoid holding your breath during the exercise."
          }
        ],
        category: "Lower Body",
        difficulty: "Beginner",
        ageRange: "Age 10-75",
        muscleGroups: "Quadriceps, Hamstrings, Glutes",
        modifications: [
          {
            type: "easier",
            name: "Higher Wall Sit",
            description: "Don't slide down as far, keeping the angle at your knees greater than 90 degrees."
          },
          {
            type: "harder",
            name: "Single-Leg Wall Sit",
            description: "Extend one leg straight out while maintaining the position."
          }
        ]
      },
      {
        name: "Plank",
        description: "A core strengthening exercise that also engages the shoulders, arms, and glutes.",
        imageUrl: "https://images.unsplash.com/photo-1566241142559-40a8b07e87a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Begin in a push-up position but with your forearms on the ground instead of your hands. Elbows should be directly beneath your shoulders.",
            keyPoint: "Your body should form a straight line from head to heels."
          },
          {
            step: 2,
            title: "Maintain Position",
            description: "Hold the position, keeping your body rigid and your core engaged.",
            keyPoint: "Don't let your hips sag down or pike up; keep your back flat."
          },
          {
            step: 3,
            title: "Proper Breathing",
            description: "Breathe steadily throughout the hold, focusing on engaging your core muscles.",
            keyPoint: "Start with shorter holds and gradually increase duration as you build strength."
          }
        ],
        category: "Core",
        difficulty: "Beginner",
        ageRange: "Age 12-80",
        muscleGroups: "Rectus Abdominis, Transverse Abdominis, Shoulders",
        modifications: [
          {
            type: "easier",
            name: "Knee Plank",
            description: "Perform the plank with your knees on the ground instead of your toes."
          },
          {
            type: "harder",
            name: "Side Plank",
            description: "Rotate to one side, supporting your weight on one forearm and the side of one foot."
          }
        ]
      },
      {
        name: "Mountain Climbers",
        description: "A dynamic exercise that combines cardio and core strengthening.",
        imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Begin in a high plank position with your hands directly under your shoulders and body forming a straight line.",
            keyPoint: "Engage your core and keep your shoulders stable."
          },
          {
            step: 2,
            title: "Alternating Knee Drives",
            description: "Drive one knee toward your chest, then quickly switch to bring the other knee forward as you extend the first leg back.",
            keyPoint: "Maintain a strong plank position without lifting your hips too high."
          },
          {
            step: 3,
            title: "Rhythm and Pace",
            description: "Continue alternating legs in a running motion, establishing a rhythm that you can maintain.",
            keyPoint: "Focus on controlled movement rather than speed, especially when first learning the exercise."
          }
        ],
        category: "Cardio",
        difficulty: "Intermediate",
        ageRange: "Age 14-65",
        muscleGroups: "Core, Hip Flexors, Shoulders",
        modifications: [
          {
            type: "easier",
            name: "Slow Mountain Climbers",
            description: "Perform the movement more slowly, bringing each knee in with a pause."
          },
          {
            type: "harder",
            name: "Cross-Body Mountain Climbers",
            description: "Twist to bring each knee toward the opposite elbow for an oblique challenge."
          }
        ]
      },
      {
        name: "Lunges",
        description: "A lower body exercise that targets the quadriceps, hamstrings, and glutes.",
        imageUrl: "https://images.unsplash.com/photo-1597347316205-38311b2c1079?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Stand with feet hip-width apart, hands on hips or alongside your body.",
            keyPoint: "Start with good posture: shoulders back, chest up, and core engaged."
          },
          {
            step: 2,
            title: "Forward Step",
            description: "Take a controlled step forward with one leg, keeping your upper body straight.",
            keyPoint: "Step should be big enough that your front heel is well in front of your hips."
          },
          {
            step: 3,
            title: "Lowering",
            description: "Lower your body by bending both knees to approximately 90 degrees. Your back knee should hover just above the floor.",
            keyPoint: "Keep your front knee aligned with your ankle, not extending beyond your toes."
          },
          {
            step: 4,
            title: "Return",
            description: "Push through the heel of your front foot to return to the starting position.",
            keyPoint: "Use your glutes and hamstrings to power the movement back up."
          }
        ],
        category: "Lower Body",
        difficulty: "Beginner",
        ageRange: "Age 12-80",
        muscleGroups: "Quadriceps, Hamstrings, Glutes",
        modifications: [
          {
            type: "easier",
            name: "Stationary Lunges",
            description: "Perform lunges in place without stepping forward."
          },
          {
            type: "harder",
            name: "Walking Lunges",
            description: "Continue moving forward with each lunge, alternating legs."
          }
        ]
      },
      {
        name: "Burpees",
        description: "A full-body exercise that builds strength and endurance while elevating heart rate.",
        imageUrl: "https://images.unsplash.com/photo-1576517387320-9376043f7660?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Stand with feet shoulder-width apart, arms at your sides.",
            keyPoint: "Begin from a stable standing position with knees slightly bent."
          },
          {
            step: 2,
            title: "Squat Down",
            description: "Lower your body into a squat position, placing your hands on the floor in front of you.",
            keyPoint: "Keep your weight in your heels as you squat down."
          },
          {
            step: 3,
            title: "Kick Back",
            description: "Kick your feet back into a plank position, keeping your body in a straight line.",
            keyPoint: "Engage your core to maintain proper alignment."
          },
          {
            step: 4,
            title: "Push-Up",
            description: "Perform a push-up by lowering your chest to the ground and pushing back up.",
            keyPoint: "Keep elbows at a 45-degree angle from your body during the push-up."
          },
          {
            step: 5,
            title: "Jump Forward",
            description: "Jump your feet back to the squat position.",
            keyPoint: "Land softly with bent knees to absorb impact."
          },
          {
            step: 6,
            title: "Explosive Jump",
            description: "Explosively jump up with arms extended overhead.",
            keyPoint: "Fully extend your hips and knees at the top of the jump."
          }
        ],
        category: "Cardio",
        difficulty: "Advanced",
        ageRange: "Age 16-60",
        muscleGroups: "Full Body",
        modifications: [
          {
            type: "easier",
            name: "Modified Burpee",
            description: "Skip the push-up and/or the jump at the end."
          },
          {
            type: "harder",
            name: "Burpee with Tuck Jump",
            description: "Add a tuck jump at the end, bringing knees toward chest during the jump."
          }
        ]
      },
      {
        name: "Bird Dog",
        description: "A core strengthening exercise that improves balance and coordination.",
        imageUrl: "https://images.unsplash.com/photo-1562088287-bde35a1ea917?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Begin on your hands and knees in a tabletop position. Hands should be directly under shoulders, knees under hips.",
            keyPoint: "Maintain a neutral spine position with head in line with your back."
          },
          {
            step: 2,
            title: "Opposite Limb Extension",
            description: "Simultaneously extend your right arm straight forward and your left leg straight backward.",
            keyPoint: "Keep both the extended arm and leg parallel to the floor."
          },
          {
            step: 3,
            title: "Core Engagement",
            description: "Hold the position for 2-3 seconds while keeping your torso stable and core engaged.",
            keyPoint: "Avoid rotating your hips or shoulders during the movement."
          },
          {
            step: 4,
            title: "Return and Alternate",
            description: "Return to the starting position and repeat with left arm and right leg.",
            keyPoint: "Move with controlled, deliberate motions rather than speed."
          }
        ],
        category: "Core",
        difficulty: "Beginner",
        ageRange: "Age 10-85",
        muscleGroups: "Core, Lower Back, Glutes, Shoulders",
        modifications: [
          {
            type: "easier",
            name: "Single Limb Extension",
            description: "Extend only one limb at a time (just arm or just leg)."
          },
          {
            type: "harder",
            name: "Bird Dog with Elbow to Knee",
            description: "Under your torso, bring extended elbow and knee together before extending again."
          }
        ]
      },
      {
        name: "Russian Twists",
        description: "An effective exercise for targeting the obliques and rotational strength of the core.",
        imageUrl: "https://images.unsplash.com/photo-1544216717-3bbf52512659?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Sit on the floor with knees bent and feet flat. Lean back slightly to engage your core, lifting feet slightly off the ground if possible.",
            keyPoint: "Maintain a straight back rather than rounding your spine."
          },
          {
            step: 2,
            title: "Hand Position",
            description: "Clasp your hands together in front of your chest, or hold a weight for added resistance.",
            keyPoint: "Keep elbows slightly bent for proper form."
          },
          {
            step: 3,
            title: "Rotation",
            description: "Rotate your torso to one side, bringing your hands or weight toward the floor beside your hip.",
            keyPoint: "The movement should come from your core, not your arms."
          },
          {
            step: 4,
            title: "Alternate Side",
            description: "Rotate to the opposite side in a controlled manner, moving through your center each time.",
            keyPoint: "Engage your obliques throughout the entire movement."
          }
        ],
        category: "Core",
        difficulty: "Intermediate",
        ageRange: "Age 14-70",
        muscleGroups: "Obliques, Rectus Abdominis",
        modifications: [
          {
            type: "easier",
            name: "Feet-Down Russian Twists",
            description: "Keep feet flat on the floor throughout the exercise."
          },
          {
            type: "harder",
            name: "Weighted Russian Twists",
            description: "Hold a medicine ball or dumbbell to increase resistance."
          }
        ]
      },
      {
        name: "Glute Bridges",
        description: "A lower body exercise that activates and strengthens the glutes and hamstrings.",
        imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Lie on your back with knees bent, feet flat on the floor hip-width apart, and arms at your sides.",
            keyPoint: "Position your feet about 12 inches from your buttocks."
          },
          {
            step: 2,
            title: "Hip Lift",
            description: "Push through your heels to lift your hips off the ground until your body forms a straight line from shoulders to knees.",
            keyPoint: "Squeeze your glutes at the top of the movement."
          },
          {
            step: 3,
            title: "Hold",
            description: "Hold the top position for 1-2 seconds, focusing on full glute contraction.",
            keyPoint: "Avoid overextending your back—maintain a neutral spine."
          },
          {
            step: 4,
            title: "Lowering",
            description: "Lower your hips back to the starting position in a controlled manner.",
            keyPoint: "Don't fully rest on the ground between repetitions to maintain tension."
          }
        ],
        category: "Lower Body",
        difficulty: "Beginner",
        ageRange: "Age 8-90",
        muscleGroups: "Glutes, Hamstrings, Lower Back",
        modifications: [
          {
            type: "easier",
            name: "Partial Glute Bridge",
            description: "Perform the movement with a smaller range of motion."
          },
          {
            type: "harder",
            name: "Single-Leg Glute Bridge",
            description: "Extend one leg straight while performing the bridge with the other."
          }
        ]
      },
      {
        name: "Tricep Dips",
        description: "An upper body exercise that targets the triceps, shoulders, and chest.",
        imageUrl: "https://images.unsplash.com/photo-1590771998996-8589ec9b5ac6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Sit on the edge of a sturdy chair or bench. Place hands beside hips, fingers pointing forward, gripping the edge. Extend legs out in front of you with a slight bend in the knees.",
            keyPoint: "Ensure the surface you're using is stable and won't move."
          },
          {
            step: 2,
            title: "Lower Body",
            description: "Slide forward off the chair, supporting your weight with your arms. Lower your body by bending your elbows to about 90 degrees.",
            keyPoint: "Keep your back close to the chair throughout the movement."
          },
          {
            step: 3,
            title: "Push Up",
            description: "Push through your palms to straighten your arms and raise your body back up to the starting position.",
            keyPoint: "Focus on using your triceps to power the movement, not your legs."
          },
          {
            step: 4,
            title: "Repeat",
            description: "Perform the movement for the desired number of repetitions, maintaining control throughout.",
            keyPoint: "Avoid locking your elbows at the top position to maintain tension."
          }
        ],
        category: "Upper Body",
        difficulty: "Intermediate",
        ageRange: "Age 14-70",
        muscleGroups: "Triceps, Shoulders, Chest",
        modifications: [
          {
            type: "easier",
            name: "Bench Dips with Bent Knees",
            description: "Keep your feet flat on the floor with knees bent to reduce the resistance."
          },
          {
            type: "harder",
            name: "Elevated Feet Dips",
            description: "Place your feet on another chair or elevated surface to increase difficulty."
          }
        ]
      },
      {
        name: "Superman",
        description: "A back-strengthening exercise that targets the entire posterior chain.",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Lie face down on a mat with arms extended overhead and legs straight out behind you.",
            keyPoint: "Position your head in a neutral alignment, looking down at the mat."
          },
          {
            step: 2,
            title: "Simultaneous Lift",
            description: "Simultaneously lift your arms, chest, and legs off the ground.",
            keyPoint: "Focus on using your back muscles rather than momentum to lift."
          },
          {
            step: 3,
            title: "Hold Position",
            description: "Hold the lifted position for 2-3 seconds, squeezing your back muscles and glutes.",
            keyPoint: "Keep your neck in a neutral position, avoiding excessive strain."
          },
          {
            step: 4,
            title: "Lower with Control",
            description: "Slowly lower your arms, chest, and legs back to the starting position.",
            keyPoint: "Maintain control throughout the entire movement."
          }
        ],
        category: "Core",
        difficulty: "Beginner",
        ageRange: "Age 10-75",
        muscleGroups: "Lower Back, Glutes, Shoulders",
        modifications: [
          {
            type: "easier",
            name: "Alternating Superman",
            description: "Lift opposite arm and leg at the same time, alternating sides."
          },
          {
            type: "harder",
            name: "Superman with Pulse",
            description: "Add small pulsing movements while in the lifted position."
          }
        ]
      },
      {
        name: "Lateral Raises",
        description: "An isolation exercise that targets the lateral deltoids for broader shoulders.",
        imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Stand with feet shoulder-width apart, holding a dumbbell in each hand at your sides, palms facing inward.",
            keyPoint: "Maintain a slight bend in your elbows throughout the exercise."
          },
          {
            step: 2,
            title: "Raise Arms",
            description: "With a slight bend in your elbows, raise your arms out to the sides until they're at shoulder level (forming a T shape with your body).",
            keyPoint: "Lead with your elbows rather than your hands."
          },
          {
            step: 3,
            title: "Controlled Descent",
            description: "Slowly lower the weights back to the starting position.",
            keyPoint: "Resist the downward pull of gravity for maximum benefit."
          },
          {
            step: 4,
            title: "Repeat",
            description: "Continue for the desired number of repetitions while maintaining proper form.",
            keyPoint: "Focus on the shoulder muscles doing the work, not momentum."
          }
        ],
        category: "Upper Body",
        difficulty: "Beginner",
        ageRange: "Age 14-75",
        muscleGroups: "Deltoids, Trapezius",
        modifications: [
          {
            type: "easier",
            name: "Seated Lateral Raises",
            description: "Perform the exercise while seated to reduce the risk of using momentum."
          },
          {
            type: "harder",
            name: "Paused Lateral Raises",
            description: "Hold the top position for 2-3 seconds before lowering."
          }
        ]
      },
      {
        name: "Calf Raises",
        description: "A lower body exercise that strengthens the calf muscles.",
        imageUrl: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Stand with feet hip-width apart, toes pointing forward. For balance, lightly hold onto a wall or chair.",
            keyPoint: "Distribute your weight evenly across both feet."
          },
          {
            step: 2,
            title: "Raise Heels",
            description: "Slowly raise your heels off the ground, standing on the balls of your feet.",
            keyPoint: "Focus on pushing through the balls of your feet and big toes."
          },
          {
            step: 3,
            title: "Full Contraction",
            description: "Reach the highest point possible, fully contracting your calf muscles.",
            keyPoint: "Hold the top position for a second to maximize the contraction."
          },
          {
            step: 4,
            title: "Lower with Control",
            description: "Slowly lower your heels back to the ground or slightly below level if on a step.",
            keyPoint: "Control the downward movement to prevent injury."
          }
        ],
        category: "Lower Body",
        difficulty: "Beginner",
        ageRange: "Age 10-90",
        muscleGroups: "Gastrocnemius, Soleus",
        modifications: [
          {
            type: "easier",
            name: "Seated Calf Raises",
            description: "Perform the movement while seated with weight on your knees."
          },
          {
            type: "harder",
            name: "Single-Leg Calf Raises",
            description: "Perform the exercise on one leg at a time."
          }
        ]
      },
      {
        name: "Seated Shoulder Press",
        description: "A strength exercise that targets the shoulders and triceps.",
        imageUrl: "https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        instructions: [
          {
            step: 1,
            title: "Starting Position",
            description: "Sit on a bench with back support. Hold dumbbells at shoulder height with palms facing forward or inward.",
            keyPoint: "Keep your back straight against the bench for proper support."
          },
          {
            step: 2,
            title: "Press Upward",
            description: "Press the weights upward until your arms are fully extended overhead without locking your elbows.",
            keyPoint: "Exhale as you push the weights up."
          },
          {
            step: 3,
            title: "Controlled Descent",
            description: "Slowly lower the weights back to shoulder level.",
            keyPoint: "Inhale as you lower the weights with control."
          },
          {
            step: 4,
            title: "Repeat",
            description: "Continue for the prescribed number of repetitions without sacrificing form.",
            keyPoint: "Maintain a neutral wrist position throughout the movement."
          }
        ],
        category: "Upper Body",
        difficulty: "Intermediate",
        ageRange: "Age 16-70",
        muscleGroups: "Deltoids, Triceps, Upper Chest",
        modifications: [
          {
            type: "easier",
            name: "Alternating Shoulder Press",
            description: "Press one arm at a time to better focus on form."
          },
          {
            type: "harder",
            name: "Standing Shoulder Press",
            description: "Perform the exercise while standing to engage more core muscles."
          }
        ]
      }
    ];

    // Add them to the store
    console.log(`Initializing ${sampleExercises.length} exercises`);
    for (let i = 0; i < sampleExercises.length; i++) {
      const exercise = sampleExercises[i];
      await this.createExercise(exercise as InsertExercise);
    }
  }
}

export const storage = new MemStorage();
