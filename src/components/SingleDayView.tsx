import SingleDay from "./SingleDay";
import Timings from "./Timings";
import { getDayName, getMonthDayNumber, hours } from "./Utils"

interface SingleDayViewProps {
    currentDateState: Date;
}

const SingleDayView = ({ currentDateState }: SingleDayViewProps) => {

    const dayName = getDayName(currentDateState);
    const monthDay = getMonthDayNumber(currentDateState)

    return (
        <>
            <div className="main-container">
                <div className="weekdays-container">
                    <SingleDay dayName={dayName} monthDay={monthDay} />
                </div>
                <div className="timing-container">
                    <Timings hours={hours} />
                </div>

                <div className="subgrid-single-day-container">
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

export default SingleDayView;