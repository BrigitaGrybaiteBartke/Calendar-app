import './SingleDayPageHeader.css'

interface SingleDayPageHeaderProps {
  dayName: string
  monthDay: number
  isToday: (dateToCheck: Date) => boolean
  currentDateState: Date
}

export default function SingleDayPageHeader({
  dayName,
  monthDay,
  isToday,
  currentDateState,
}: SingleDayPageHeaderProps) {
  return (
    <>
      <div className="day">
        <span className="day-name">{dayName}</span>
        <span className={`month-day ${isToday(currentDateState) && 'today'}`}>
          {monthDay}
        </span>
      </div>
    </>
  )
}
