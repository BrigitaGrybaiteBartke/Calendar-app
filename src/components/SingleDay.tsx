import React from "react";
import "./assets/SingleDay.css";
import { today } from "./utils/Utils";

interface SingleDayProps {
  dayName: string;
  monthDay: number;
  isToday: (dateToCheck: Date) => boolean;
  currentDateState: Date;
}

const SingleDay = ({
  dayName,
  monthDay,
  isToday,
  currentDateState,
}: SingleDayProps) => {
  return (
    <>
      <div className="day">
        <span className="day-name">{dayName}</span>
        <span className={`month-day ${isToday(currentDateState) && "today"}`}>
          {monthDay}
        </span>
      </div>
    </>
  );
};

export default SingleDay;
