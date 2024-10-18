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

export interface Set {
  weight: number;
  reps: number;
  RPE: number;
}

export interface Exercise {
  exerciseId: string;
  name: string;
  sets: Set[];
}

export interface Client {
  firstName: string;
  lastName: string;
}

export interface Collaboration {
  client: Client;
}

