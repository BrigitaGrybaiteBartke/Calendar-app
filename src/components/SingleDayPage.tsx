import { useEffect, useRef, useState } from "react";
import SingleDay from "./SingleDay";
import Timings from "./Timings";
import { getDayName, getMonthDayNumber, hours } from "./utils/Utils"
import './assets/SingleDay.css'
import './assets/Timings.css'
import './assets/SubgridSingleDay.css'
import './assets/Form.css'

interface SingleDayPageProps {
    currentDateState: Date;
}

interface Task {
    id: string;
    name: string;
    date: string,
    startHour: string,
    endHour: string
}

const SingleDayPage = ({ currentDateState }: SingleDayPageProps) => {

    const dayName = getDayName(currentDateState);
    const monthDay = getMonthDayNumber(currentDateState)

    const containerRef = useRef<HTMLDivElement>(null)
    const boxRef = useRef<HTMLDivElement>(null)

    const [isDragging, setIsDragging] = useState(false);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskDetails, setTaskDetails] = useState({
        name: '',
        date: '',
        startHour: '',
        endHour: ''
    })

    const handleInputChange = (e: any) => {
        e.preventDefault()
        const { name, value } = e.target
        setTaskDetails((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFormSubmit = (e: any) => {
        e.preventDefault();

        const selectedDate = taskDetails.date ? taskDetails.date : currentDateState.toISOString()

        const newTask = {
            id: Date.now().toString(),
            name: taskDetails.name,
            date: selectedDate,
            startHour: taskDetails.startHour,
            endHour: taskDetails.endHour
        }
        setTasks((prevTasks) => [...prevTasks, newTask]);
    }

    useEffect(() => {
        if (!boxRef.current || !containerRef.current) return

        const box = boxRef.current
        const container = containerRef.current

        const dragStart = (e: any) => {
            setIsDragging(true)
            if (box?.className.includes('box')) {
                box.classList.add('dragging')
            }

            const targetElement = e.target as HTMLDivElement | null

            if (targetElement) {
                const id = targetElement.id;
                e.dataTransfer.setData('text/plain', id);
            }

            setTimeout(() => {
                if (targetElement)
                    targetElement.classList.add('hide');
            }, 0);

        }

        const drag = (e: any) => { }

        const dragEnd = (e: any) => {
            setIsDragging(false)
            if (box?.className.includes('box')) {
                box.classList.remove('dragging')
            }
        }

        const dragOver = (e: any) => {
            setIsDragging(true)
            if (e.dataTransfer.types[0] === "text/plain") {
                e.preventDefault();
            }
        }

        const drop = (e: any) => {
            e.preventDefault()
            setIsDragging(false)

            const id = e.dataTransfer.getData('text/plain')
            const draggable = document.getElementById(id)

            if (typeof id === 'undefined' || !id) return
            if (typeof draggable !== 'object' || draggable === null) return

            const rect = e.target.getBoundingClientRect()

            const updatedY = e.clientY - rect.top
            const updatedX = e.clientX - rect.left

            const timingCellHeight = 50;
            const minutesPerCell = 60
            const timingCellIndex = Math.floor(updatedY / timingCellHeight)

            const movedMinutes = timingCellIndex * minutesPerCell;
            const movedHours = Math.floor(movedMinutes / 60);
            const movedMinutesRemainder = movedMinutes % 60;

            const startDateCoords = new Date(currentDateState)
            startDateCoords.setHours(movedHours, movedMinutesRemainder, 0, 0);

            const endDateCoords = new Date(startDateCoords);
            endDateCoords.setMinutes(startDateCoords.getMinutes() + minutesPerCell);

            const options = {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
            } as Intl.DateTimeFormatOptions;

            const startHour = startDateCoords.toLocaleTimeString([], options);
            const endHour = endDateCoords.toLocaleTimeString([], options);

            const updatedTasks = tasks.map((task) => {
                if (task.id.toString() === id) {
                    return {
                        ...task,
                        startDateCoords,
                        startHour,
                        endHour
                    };
                }
                return task;
            })

            setTasks(updatedTasks)

            draggable.classList.remove('hide');
            draggable.style.transform = `translate(0, ${timingCellIndex * timingCellHeight}px)`
            e.target.appendChild(draggable)

        }

        box.addEventListener('dragstart', dragStart)
        box.addEventListener('drag', drag)
        box.addEventListener('dragend', dragEnd)
        container.addEventListener('dragover', dragOver);
        container.addEventListener('drop', drop);

    }, [ tasks])

    return (
        <>
            <div className="form">
                <form
                    onSubmit={handleFormSubmit}
                >
                    <label>Enter Task</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter task..."
                        onChange={handleInputChange}
                        value={taskDetails.name}
                    />
                    <label>Start Date:</label>
                    <input
                        type="date"
                        name="date"
                        onChange={handleInputChange}
                        value={taskDetails.date}
                    />
                    <label>Start Hour:</label>
                    <input
                        type="time"
                        name="startHour"
                        onChange={handleInputChange}
                        value={taskDetails.startHour}
                    />
                    <label>End Hour:</label>
                    <input
                        type="time"
                        name="endHour"
                        onChange={handleInputChange}
                        value={taskDetails.endHour}
                    />
                    <button type="submit" className="submit-button">Add</button>
                </form>
            </div>

            <div className="container-day">
                <div className="day-container">
                    <SingleDay dayName={dayName} monthDay={monthDay} />
                </div>
                <div className="timing-container">
                    <Timings hours={hours} />
                </div>

                <div className="subgrid-single-day-container"
                    ref={containerRef}
                >
                    {tasks && tasks.map((task) => (
                        <div
                            key={`${task.id} ? ${task.id} : ''`}
                            className='box'
                            draggable={true}
                            ref={boxRef}
                            id={task.id}
                        >
                            <div>Task Name: {task.name}</div>
                            <div>Start date: {task.date}</div>
                            <div>{task.startHour}&nbsp;-&nbsp;{task.endHour}</div>                            
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SingleDayPage;