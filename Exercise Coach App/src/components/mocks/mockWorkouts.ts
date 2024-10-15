import benchpressImage from "../assets/WorkoutImages/benchpress.jpeg";

export interface ExerciseSet {
  weight: number;
  reps: number;
  rpe: number;
  completed: boolean;
}

export interface Exercise {
  exercise: { 
    name: string; 
    description: string; 
    image?: string; // Optional image field
  };
  sets: ExerciseSet[];
}

export interface Workout {
  _id: string;
  title: string;
  coachName: string;
  date: Date;
  description: string;
  exercises: Exercise[];
}

const mockWorkouts: Workout[] = [
  {
    _id: "001",
    title: "Push Day",
    coachName: "Kyriakos Kapakoulak",
    date: new Date(),
    description:
      "A focused workout on push exercises targeting the chest and shoulders.",
    exercises: [
      {
        exercise: { 
          name: "Bench Press (Barbell)",
          description: `To perform the perfect bench press, follow these key steps:
            1. Setup: Lie on a flat bench with your eyes under the bar, feet firmly on the ground, and grip the bar slightly wider than shoulder-width.
            2. Create Tension: Engage your body by pushing your feet into the floor and retracting your shoulder blades for stability.
            3. Unrack the Bar: Lift the bar off the rack and position it above your shoulders with locked elbows.
            4. Descent: Lower the bar slowly to your lower chest (around nipple level) with elbows at a 45-degree angle.
            5. Press Up: Pause briefly on your chest, then push the bar back up explosively while keeping it angled slightly towards your face.
            6. Breathing: Inhale before lowering the bar and exhale forcefully while pressing up for stability.`,
          image: benchpressImage,
        },
        sets: [
          { weight: 60, reps: 8, rpe: 7, completed: false },
          { weight: 70, reps: 6, rpe: 8, completed: false },
          { weight: 75, reps: 5, rpe: 9, completed: false },
        ],
      },
      {
        exercise: { 
          name: "Incline Dumbbell Press",
          description: "A great exercise for targeting the upper part of the chest.",
          image: benchpressImage,
        },
        sets: [
          { weight: 40, reps: 10, rpe: 6, completed: false },
          { weight: 45, reps: 8, rpe: 7, completed: false },
          { weight: 50, reps: 6, rpe: 8, completed: false },
        ],
      },
    ],
  },
];

export default mockWorkouts;
