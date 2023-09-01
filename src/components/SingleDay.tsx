import "./assets/SingleDay.css";

interface SingleDayProps {
  dayName: string;
  monthDay: number;
  isToday: (dateToCheck: Date) => boolean;
  currentDateState: Date;
}

export default function SingleDay ({
  dayName,
  monthDay,
  isToday,
  currentDateState,
}: SingleDayProps) {
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
}