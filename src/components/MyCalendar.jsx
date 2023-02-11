import React, { useState } from "react";
import "./MyCalendar.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";

function MyCalendar() {
  const [selectedDay, setSelectedDay] = useState(null);
  return (
    <div className="calendar_div">
      <Calendar value={selectedDay} onChange={setSelectedDay} shouldHighlightWeekends />
    </div>
  );
}

export default MyCalendar;
