import { WeekPageHeaderProps } from '../../utils/Types'
import { isToday } from '../../utils/Utils'
import './WeekPageHeader.css'

export default function WeekPageHeader({
  weekDayNames,
  firstDateOfWeek,
  lastDateOfWeek,
}: WeekPageHeaderProps) {
  const wholeWeek: Date[] = []

  for (
    let i = new Date(firstDateOfWeek);
    i <= lastDateOfWeek;
    i.setDate(i.getDate() + 1)
  ) {
    wholeWeek.push(new Date(i))
  }

  return (
    <>
      <div className="weekdays">
        {weekDayNames.map((day, dayIndex) => (
          <div key={dayIndex} className="day">
            <div className={`vertical-line-${dayIndex + 1}`} />
            <span className="day-name" data-day={day}>
              {day}
            </span>
            <span
              className={`month-day ${
                isToday(wholeWeek[dayIndex]) ? 'today' : ''
              }`}
            >
              {wholeWeek[dayIndex].getDate()}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}
