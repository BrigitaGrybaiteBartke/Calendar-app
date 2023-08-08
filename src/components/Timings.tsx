import React from "react";

interface TimingProps {
  hours: number[];
}

const Timings = ({ hours }: TimingProps) => {
  return (
    <>
      <div className="timings">
        {hours.map((hour: number, hourIndex: number) => (
          <div key={hourIndex} className="time">
            <span>{hour.toString().padStart(2, "0")}:00</span>
            <div className="time-line"></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Timings;
