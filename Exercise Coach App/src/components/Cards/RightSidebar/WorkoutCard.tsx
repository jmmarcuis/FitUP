import React from 'react';
import './WorkoutCard.scss';

interface WorkoutCardProps {
  title: string;
  exercises: { name: string; sets: number; reps: number; image: string }[];
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ title, exercises }) => {
  return (
    <div className="workout-card">
      <h4>{title}</h4>
      <ul>
        {exercises.map((exercise, index) => (
          <li key={index}>
            <img src={exercise.image} alt={exercise.name} />
            <div className="exercise-details">
              <p>{exercise.name}</p>
              <span>{exercise.sets}x{exercise.reps}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutCard;