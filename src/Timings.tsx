import React from 'react';

interface TimingProps {
    hours: number[];
}

const Timings = ({ hours }: TimingProps) => {

    return (
        <>
            <div className='timings'>
                <div className="time"></div>
                {hours.map((hour: number, hourIndex: number) => (
                    <div key={hourIndex} className='time'>{hour.toString().padStart(2, '0')}:00</div>
                ))}
            </div>
        </>
    );
};

export default Timings;