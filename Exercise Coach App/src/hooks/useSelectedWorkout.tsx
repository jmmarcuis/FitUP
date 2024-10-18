import { useState } from 'react';

export interface Workout {
  _id: string;
  name: string;
  description: string;
  date: string;
  exercises: Array<{
    exerciseId: string;
    name: string;
    sets: Array<{
      reps: number;
      weight: number;
      RPE: number;
    }>;
  }>;
  collaboration: {
    client: {
      firstName: string;
      lastName: string;
    };
  };
}

const useSelectedWorkout = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  return { selectedWorkout, setSelectedWorkout };
};

export default useSelectedWorkout;