import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays, isSameDay } from 'date-fns';
import { motion } from "framer-motion";
import "./Calendar.scss"
import { useWorkout } from '../../hooks/useWorkout';

const Calendar: React.FC = () => {
  const { selectedDate, setSelectedDate, fetchWorkouts } = useWorkout();
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    fetchWorkouts(date);
    setIsDatePickerOpen(false);
  };

  const renderWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(selectedDate, i - selectedDate.getDay());
      const isSelected = isSameDay(date, selectedDate);
      days.push(
        <motion.div
          whileHover={{ scale: 1.1 }}
          key={i}
          className={`day-button ${isSelected ? 'selected' : ''} ${
            date.getMonth() !== selectedDate.getMonth() ? 'different-month' : ''
          }`}
          onClick={() => handleDateChange(date)}
        >
          <div className="day-name">{format(date, 'EEE').toUpperCase()}</div>
          <div className="day-number">{format(date, 'd')}</div>
        </motion.div>
      );
    }
    return days;
  };

  return (
    <div className="calendar">
      <div className="month-year" onClick={() => setIsDatePickerOpen(true)}>
        {format(selectedDate, 'MMMM yyyy')}
      </div>
      <div className="week-view">{renderWeekDays()}</div>
      {isDatePickerOpen && (
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          inline
          onClickOutside={() => setIsDatePickerOpen(false)}
        />
      )}
    </div>
  );
};

export default Calendar;