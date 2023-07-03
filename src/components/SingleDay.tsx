import React from 'react';

interface SingleDayProps {
    dayName: string;
    monthDay: number;
}

const SingleDay = ({ dayName, monthDay }: SingleDayProps) => {

    return (
        <>
            <div className='weekdays'>
                <div className='day'>
                    <span className='day-name'>{dayName}</span>
                    <span className='month-day'>{monthDay}</span>
                </div>
            </div>
        </>
    );
};

export default SingleDay;