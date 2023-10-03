import { DayPageHeaderProps } from '../../utils/Types'
import './DayPageHeader.css'

export default function DayPageHeader({
  dayName,
  monthDay,
  isToday,
  currentDateState,
}: DayPageHeaderProps) {
  return (
    <>
      <div className={`vertical-line-1`} />

      <div className="day">
        <span className="day-name">{dayName}</span>
        <span className={`month-day ${isToday(currentDateState) && 'today'}`}>
          {monthDay}
        </span>
      </div>
    </>
  )
}
