import { DayPageHeaderProps } from '../../utils/Types'
import { isToday } from '../../utils/Utils'
import './DayPageHeader.css'

export default function DayPageHeader({
  dayName,
  monthDay,
  currentDateState,
}: DayPageHeaderProps) {
  return (
    <>
      <div className="vertical-line" />
      <div className="day">
        <span className="day-name">{dayName}</span>
        <span className={`month-day ${isToday(currentDateState) && 'today'}`}>
          {monthDay}
        </span>
      </div>
    </>
  )
}
