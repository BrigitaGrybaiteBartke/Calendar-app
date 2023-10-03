import { TimingsProps } from '../../utils/Types'

export default function Timings({ hours }: TimingsProps) {
  return (
    <>
      <div className="timings">
        {hours.map((hour: number, hourIndex: number) => (
          <div key={hourIndex} className="timeline">
            <div className={`horizontal-line`} />
            <span className="time">{hour.toString().padStart(2, '0')}:00</span>
          </div>
        ))}
      </div>
    </>
  )
}
