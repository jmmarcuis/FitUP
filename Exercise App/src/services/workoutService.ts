import api from './api';

export interface Exercise {
  id?: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface Workout {
  id?: string;   
  name: string;
  date: string;
  exercises: Exercise[];
}
export const getWorkouts = async (): Promise<Workout[]> => {
  const response = await api.get('/workouts');
  return response.data as Workout[];  // Cast response.data to Workout[]
};

export const getWorkoutById = async (id: string): Promise<Workout> => {
  const response = await api.get(`/workouts/${id}`);
  return response.data;
};

export const createWorkout = async (workoutData: Omit<Workout, 'id'>): Promise<Workout> => {
  const response = await api.post('/workouts', workoutData);
  return response.data;
};

export const updateWorkout = async (id: string, workoutData: Partial<Workout>): Promise<Workout> => {
  const response = await api.put(`/workouts/${id}`, workoutData);
  return response.data;
};

export const deleteWorkout = async (id: string): Promise<void> => {
  await api.delete(`/workouts/${id}`);
};

export const addExerciseToWorkout = async (workoutId: string, exerciseData: Omit<Exercise, 'id'>): Promise<Workout> => {
  const response = await api.post(`/workouts/${workoutId}/exercises`, exerciseData);
  return response.data;
};

export const updateExerciseInWorkout = async (workoutId: string, exerciseId: string, exerciseData: Partial<Exercise>): Promise<Workout> => {
  const response = await api.put(`/workouts/${workoutId}/exercises/${exerciseId}`, exerciseData);
  return response.data;
};

export const removeExerciseFromWorkout = async (workoutId: string, exerciseId: string): Promise<Workout> => {
  const response = await api.delete(`/workouts/${workoutId}/exercises/${exerciseId}`);
  return response.data;
};

export const getWorkoutsByDateRange = async (startDate: string, endDate: string): Promise<Workout[]> => {
  const response = await api.get('/workouts', { params: { startDate, endDate } });
  return response.data;
};