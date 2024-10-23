// hooks/useWorkout.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface WorkoutSet {
  reps: number;
  weight: number;
  RPE: number;
}

interface Exercise {
  exerciseId: string;
  images:string;
  name: string;
  sets: WorkoutSet[];
}

interface Coach {
  firstName: string;
  lastName: string;
  profilePicture: string;
}

interface Collaboration {
  coach: Coach;
  client: {
    firstName: string;
    lastName: string;
  };
}

interface Workout {
  _id: string;
  name: string;
  description: string;
  date: string;
  exercises: Exercise[];
  collaboration: Collaboration;
}

interface UseWorkoutResult {
  workout: Workout | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const useWorkout = (selectedDate: string): UseWorkoutResult => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkout = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Format the date to ensure consistency
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

      console.log("Fetching workout for date:", formattedDate); // Debug log

      const response = await axios.get<{
        message: string;
        success: boolean;
        data: Workout;
      }>(`http://localhost:5000/workout/client-workout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          date: formattedDate,
        },
      });

      console.log("Workout response:", response.data); // Debug log

      if (response.data.success) {
        setWorkout(response.data.data);
        setError(null);
      } else {
        throw new Error(response.data.message || "Failed to fetch workout");
      }
    } catch (err) {
      console.error("Error fetching workout:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch workout");
      setWorkout(null);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      fetchWorkout();
    }
  }, [fetchWorkout, selectedDate]);

  return { workout, loading, error, refetch: fetchWorkout };
};

export default useWorkout;
