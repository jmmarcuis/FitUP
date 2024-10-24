import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // You'll need to install this package
import 'react-datepicker/dist/react-datepicker.css';

interface WorkoutCalendarProps {
  onDateSelect: (date: Date) => void;
}

export const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  return (
    <div className="workout-calendar">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        inline
        calendarClassName="custom-calendar"
      />
    </div>
  );
};