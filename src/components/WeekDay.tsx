import React from "react";
import "./assets/WeekDay.css";

interface WeekDayProps {
  dayNames: string[];
  firstDateOfWeek: Date;
  lastDateOfWeek: Date;
}

const WeekDay = ({
  dayNames,
  firstDateOfWeek,
  lastDateOfWeek,
}: WeekDayProps) => {
  const wholeWeek: Date[] = [];

  for (
    let i = new Date(firstDateOfWeek);
    i <= lastDateOfWeek;
    i.setDate(i.getDate() + 1)
  ) {
    wholeWeek.push(new Date(i));
  }

  return (
    <>
      <div className="weekdays">
        {dayNames.map((day, dayIndex) => (
          <div key={dayIndex} className="day day-box">
            <>
              <span className="day-name" data-day={day}>
                {day}
              </span>
              <span className="month-day">{wholeWeek[dayIndex].getDate()}</span>
            </>
          </div>
        ))}
      </div>
    </>
  );
};

export default WeekDay;
