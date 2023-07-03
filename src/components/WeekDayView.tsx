import '../App.css'
import Timings from './Timings';
import WeekDay from './WeekDay';
import { getFirstDateOfWeek, getLastDateOfWeek, hours, weekDayNames } from './Utils'

interface WeekDayViewProps {
    currentDateState: Date;
}

const WeekDayView = ({ currentDateState }: WeekDayViewProps) => {
    
    const firstDateOfWeek = getFirstDateOfWeek(currentDateState);
    const lastDateOfWeek = getLastDateOfWeek(currentDateState)
 
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