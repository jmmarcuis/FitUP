import { useState } from 'react';
import { Workout } from '../Types/Workout';



const useSelectedWorkout = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  return { selectedWorkout, setSelectedWorkout };
};

export default useSelectedWorkout;