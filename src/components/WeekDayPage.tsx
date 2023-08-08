import "../App.css";
import Timings from "./Timings";
import WeekDay from "./WeekDay";
import {
  getFirstDateOfWeek,
  getLastDateOfWeek,
  hours,
  weekDayNames,
} from "./utils/Utils";
import "./assets/WeekDayPage.css";
import { useEffect, useRef, useState } from "react";

interface Task {
  id: string;
  name: string;
  date: string;
  startHour: string;
  endHour: string;
}

interface WeekDayPageProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  currentDateState: Date;
  
}

const WeekDayPage = ({
  tasks,
  setTasks,
  currentDateState,
}: WeekDayPageProps) => {
  const firstDateOfWeek = getFirstDateOfWeek(currentDateState);
  const lastDateOfWeek = getLastDateOfWeek(currentDateState);

  const containerRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isDragging, setIsDragging] = useState(false);


  const tasksForCurrentDay = tasks.filter(
    (task) => task.date === currentDateState.toISOString().substring(0, 10)
  );


  const calculateTopPosition = (taskStartTime: string) => {
    const [hours, minutes] = taskStartTime.split(":").map(Number);
  
    const totalMinutes = hours * 60 + minutes;
    const timingCellHeight = 50;
    const minutesPerCell = 60;
    const timingCellIndex = Math.floor(totalMinutes / minutesPerCell);
  
    console.log(` top value: ${timingCellIndex * timingCellHeight}px`)
  
    return `${timingCellIndex * timingCellHeight}px`;
  };



  useEffect(() => {
    if (!boxRefs.current || !containerRef.current) return;

    const container = containerRef.current;

    const dragStart = (e: any) => {
      // console.log("drag start");
      setIsDragging(true);

      const targetElement = e.target as HTMLDivElement | null;

      if (targetElement && targetElement.className.includes("box")) {
        targetElement.classList.add("dragging");
        e.dataTransfer.setData("text/plain", targetElement.id);
      }

      setTimeout(() => {
        if (targetElement) targetElement.classList.add("hide");
      }, 0);
    };

    const drag = (e: any) => {};

    const dragEnd = (e: any) => {
      // console.log('drag end')
      setIsDragging(false);
      const targetElement = e.target as HTMLDivElement | null;

      if (targetElement && targetElement.className.includes("box")) {
        targetElement.classList.remove("dragging");
      }
    };

    const dragOver = (e: any) => {
      // console.log('draging over')
      setIsDragging(true);
      if (e.dataTransfer.types[0] === "text/plain") {
        e.preventDefault();
      }
    };

    const drop = (e: any) => {
      e.preventDefault();
      setIsDragging(false);

      const id = e.dataTransfer.getData("text/plain");
      const draggable = document.getElementById(id); // visas draggable elementas

      if (!id || !draggable || !container) return;

      const rect = e.target.getBoundingClientRect();

      const updatedY = e.clientY - rect.top;
      const updatedX = e.clientX - rect.left;

      const timingCellHeight = 50;
      const minutesPerCell = 60;
      const timingCellIndex = Math.floor(updatedY / timingCellHeight);

      const movedMinutes = timingCellIndex * minutesPerCell;
      const movedHours = Math.floor(movedMinutes / 60);
      const movedMinutesRemainder = movedMinutes % 60;


      const dayBoxIndex = Math.floor(updatedX / (rect.width / 7));
      const dayBox = document.querySelectorAll('.day-box')[dayBoxIndex];


      const startDateCoords = new Date(currentDateState);
      startDateCoords.setDate(firstDateOfWeek.getDate() + dayBoxIndex);
      startDateCoords.setHours(movedHours, movedMinutesRemainder, 0, 0); // per kiek valandu pasislinko zemyn

      const timingCellWidth = rect.width / 7;
      const leftPosition = dayBoxIndex * timingCellWidth;


      const endDateCoords = new Date(startDateCoords);
      endDateCoords.setMinutes(startDateCoords.getMinutes() + minutesPerCell);
      
      const options = {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      } as Intl.DateTimeFormatOptions;


      const startHour = startDateCoords.toLocaleTimeString([], options);
      const endHour = endDateCoords.toLocaleTimeString([], options);


      // console.log(startDateCoords)

      const updatedTasks = tasks.map((task) => {
        if (task.id.toString() === id) {
          return {
            ...task,
            startDateCoords,
            startHour,
            endHour,
          };
        }
        return task;
      });

      setTasks(updatedTasks);



      if (draggable.className.includes("box")) {
        // draggable.style.transform = `translate(${
        //   dayBoxIndex * (rect.width / 7)
        // }px, ${timingCellIndex * timingCellHeight}px)`;
        draggable.style.top = `${
          timingCellIndex * timingCellHeight
        }px)`

        draggable.style.left = `${leftPosition}px`;

        draggable.classList.remove("hide");
        e.target.appendChild(draggable);
      }

      // const dayBoxIndex = Math.floor(updatedX / (rect.width / 7));

    };

    boxRefs.current.forEach((boxRef) => {
      if (boxRef) {
        boxRef.addEventListener("dragstart", dragStart);
        boxRef.addEventListener("dragend", dragEnd);
      }
    });

    container.addEventListener("dragover", dragOver);
    container.addEventListener("drop", drop);

    return () => {
      boxRefs.current.forEach((boxRef) => {
        if (boxRef) {
          boxRef.removeEventListener("dragstart", dragStart);
          boxRef.removeEventListener("dragend", dragEnd);
        }
      });
      container.removeEventListener("dragover", dragOver);
      container.removeEventListener("drop", drop);
    };
  }, [tasks, currentDateState]);

   
  return (
    <>
      <div className="content-grid">
        <div className="week-container">
          <div className="weekdays-container">
            <WeekDay
              dayNames={weekDayNames}
              firstDateOfWeek={firstDateOfWeek}
              lastDateOfWeek={lastDateOfWeek}
            />
          </div>
          <div className="timing-container">
            <Timings hours={hours} />
          </div>

          <div className="subgrid-weekdays-container" ref={containerRef}>
          {/* // Filter tasks for the current day */}

            {tasksForCurrentDay &&
              tasksForCurrentDay.map((task, index) => (
                <div
                  key={task.id || ""}
                  className="box"
                  draggable={true}
                  ref={(ref) => (boxRefs.current[index] = ref)}
                  id={task.id}
                  style={{ top: calculateTopPosition(task.startHour) }} 
                >
                  <div>Task Name: {task.name}</div>
                  <div>Start date: {task.date}</div>
                  <div>
                    {task.startHour}&nbsp;-&nbsp;{task.endHour}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WeekDayPage;
