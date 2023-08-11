import React from "react";

interface TimingProps {
  hours: number[];
}

const Timings = ({ hours }: TimingProps) => {
  return (
    <>
      <div className="timings">
        {hours.map((hour: number, hourIndex: number) => (
          <>
             <div key={hourIndex} className="time">
              <div className="horizontal-line" />
              <span>{hour.toString().padStart(2, "0")}:00</span>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default Timings;
