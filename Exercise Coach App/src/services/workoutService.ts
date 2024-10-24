import api from "./api";
import { format } from 'date-fns';
import { Workout, WorkoutExercise} from '../Types/Workout';

const API_BASE_URL = "http://localhost:5000/workout";

export const fetchWorkoutsByDate = async (date: Date): Promise<Workout[]> => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const response = await api.get(`${API_BASE_URL}/date/${formattedDate}`);
 
  if (Array.isArray(response.data)) {
    return response.data;
  } else if (typeof response.data === 'object' && response.data !== null) {
    return [response.data];
  } else {
    throw new Error('Unexpected data format received from server');
  }
};

export const createWorkout = async (title: string, date: Date): Promise<Workout> => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const response = await api.post(API_BASE_URL, { title, date: formattedDate });
  return response.data;
};


export const addExerciseToWorkout = async (
  workoutId: string,
  exerciseId: string
): Promise<Workout> => {
  const response = await api.post(`${API_BASE_URL}/add-exercise`, {
    workoutId,
    exerciseId
  });
  return response.data;
};

export const addSetToExercise = async (
  workoutId: string,
  exerciseIndex: number,
  set: WorkoutExercise['sets'][0]
): Promise<Workout> => {
  const response = await api.post(`${API_BASE_URL}/${workoutId}/exercises/${exerciseIndex}/sets`, set);
  return response.data;
};