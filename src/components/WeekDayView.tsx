import '../App.css'
import Timings from './Timings';
import WeekDay from './WeekDay';
import { hours, weekDayNames } from './Utils'

interface WeekDayViewProps {
    currentDateState: Date;
}

const WeekDayView = ({ currentDateState }: WeekDayViewProps) => {

    const getFirstDateOfWeek = (d: Date = new Date()) => {
        const date = new Date(d);
        const day = date.getDay(); // 👉️ get day of week
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    }

    const firstDateOfWeek = getFirstDateOfWeek(currentDateState);

    const lastDateOfWeek = new Date(firstDateOfWeek)
    lastDateOfWeek.setDate(lastDateOfWeek.getDate() + 6)
    
    return (
        <>
            <div className='main-container'>
                <div className='weekdays-container'>
                    <WeekDay
                        dayNames={weekDayNames}
                        firstDateOfWeek={firstDateOfWeek}
                        lastDateOfWeek={lastDateOfWeek}
                    />
                </div>

                <div className='timing-container'>
                    <Timings hours={hours} />

                </div>

                <div className="subgrid-weekdays-container">
                    <div className="slot">
                        <h2>Task 1</h2>
                        <div className="details">
                            <span>Time:</span>
                        </div>
                    </div>
                    <div className="slot">
                        <h2>Task 1</h2>
                        <div className="details">
                            <span>Time:</span>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default WeekDayView;