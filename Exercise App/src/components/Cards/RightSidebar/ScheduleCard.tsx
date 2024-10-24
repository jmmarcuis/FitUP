import React from 'react';
import './ScheduleCard.scss';

interface ScheduleCardProps {
  title: string;
  schedules: { name: string; date: string; image: string }[];
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ title, schedules }) => {
  return (
    <div className="schedule-card">
      <h4>{title}</h4>
      <ul>
        {schedules.map((schedule, index) => (
          <li key={index}>
            <img src={schedule.image} alt={schedule.name} />
            <div className="schedule-details">
              <p>{schedule.name}</p>
              <span>{schedule.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleCard;
