import './WeekDayPageHeader.css'

interface WeekDayPageHeaderProps {
  weekDayNames: string[]
  firstDateOfWeek: Date
  lastDateOfWeek: Date
  isToday: (dateToCheck: Date) => boolean
}

export default function WeekDayPageHeader({
  weekDayNames,
  firstDateOfWeek,
  lastDateOfWeek,
  isToday,
}: WeekDayPageHeaderProps) {
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
            <>
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
            </>
          </div>
        ))}
      </div>
    </>
  )
}
