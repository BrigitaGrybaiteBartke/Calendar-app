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
    startDate: string,
    endDate: string,
    formattedHours?: string
}

const SingleDayPage = ({ currentDateState }: SingleDayPageProps) => {

    const dayName = getDayName(currentDateState);
    const monthDay = getMonthDayNumber(currentDateState)

    const containerRef = useRef<HTMLDivElement>(null)
    const boxRef = useRef<HTMLDivElement>(null)

    const [isDragging, setIsDragging] = useState(false);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskDetails, setTaskDetails] = useState({
        name: "",
        startDate: "",
        endDate: "",
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

        const newTask = {
            id: Date.now().toString(),
            name: taskDetails.name,
            startDate: taskDetails.startDate,
            endDate: taskDetails.endDate
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

            const options = {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
            } as Intl.DateTimeFormatOptions;

            const formattedHours = startDateCoords.toLocaleTimeString([], options);

            console.log(typeof formattedHours)
            // const endDateCoords = new Date(startDateCoords.getTime() + minutesPerCell * 60000);

            const updatedTasks = tasks.map((task) => {
                if (task.id.toString() === id) {
                    const startDateCoords = new Date(currentDateState)
                    startDateCoords.setHours(0, minutesPerCell * timingCellIndex, 0, 0)
                    const endDateCoords = new Date(startDateCoords.getTime() + minutesPerCell * 60000 - 1);

                    return {
                        ...task,
                        startDate: startDateCoords.toString(),
                        endDate: endDateCoords.toString(),
                        formattedHours: formattedHours
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

    }, [])

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
                        name="startDate"
                        onChange={handleInputChange}
                        value={taskDetails.startDate}
                    />

                    <label>End Date:</label>
                    <input
                        type="date"
                        name="endDate"
                        value={taskDetails.endDate}
                        onChange={handleInputChange}
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
                            <p>Task Name: {task.name}</p>
                            <p>Moved hours: {task.formattedHours}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SingleDayPage;