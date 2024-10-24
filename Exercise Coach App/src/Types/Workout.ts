import { Exercise } from './Exercise';

export interface WorkoutExercise {
  exercise: Exercise;
  sets: Array<{
    reps: number;
    weight: number;
    completed: boolean;
    rpe: number;
  }>;

}

export interface Workout {
  _id: string;
  title: string;
  date: Date;
  exercises: WorkoutExercise[];
}