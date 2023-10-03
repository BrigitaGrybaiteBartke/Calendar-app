import { useEffect, useRef, useState } from 'react'
import Timings from '../timings/Timings'
import WeekDay from './WeekPageHeader'
import {
  calculateLeftPosition,
  calculateTopPosition,
  getFirstDateOfWeek,
  getLastDateOfWeek,
  hours,
  weekDayNames,
} from '../../utils/Utils'
import './WeekPage.css'
import '../../App.css'
import { putDataRequest } from '../../utils/Api'
import { TasksWithPosition, WeekPageProps } from '../../utils/Types'

export default function WeekPage({
  tasks,
  setTasks,
  currentDateState,
  currentWeekTasks,
  isToday,
  setShowUpdateForm,
  setSelectedTask,
}: WeekPageProps) {
  const firstDateOfWeek = getFirstDateOfWeek(currentDateState)
  const lastDateOfWeek = getLastDateOfWeek(currentDateState)
  const containerRef = useRef<HTMLDivElement>(null)
  const boxRefs = useRef<(HTMLDivElement | null)[]>([])

  const [isDragging, setIsDragging] = useState(false)

  const url = 'http://localhost:8000/tasks'

  const tasksWithPosition: TasksWithPosition[] = currentWeekTasks.map(
    (task) => {
      const top = calculateTopPosition(task.startHour)
      const left = calculateLeftPosition(new Date(task.date))

      if (typeof top === 'number' && typeof left === 'number') {
        return {
          ...task,
          top,
          left,
        }
      } else {
        return {
          ...task,
          top: 0,
          left: 0,
        }
      }
    },
  )

  useEffect(() => {
    if (!boxRefs.current || !containerRef.current) return

    const container = containerRef.current

    const dragStart = (e: any) => {
      setIsDragging(true)

      const targetElement = e.target as HTMLDivElement | null

      if (targetElement && targetElement.className.includes('box')) {
        targetElement.classList.add('dragging')
        e.dataTransfer.setData('text/plain', targetElement.id)
      }

      setTimeout(() => {
        if (targetElement) targetElement.classList.add('hide')
      }, 0)
    }

    const dragEnd = (e: any) => {
      setIsDragging(false)
      const targetElement = e.target as HTMLDivElement | null

      if (targetElement && targetElement.className.includes('box')) {
        targetElement.classList.remove('dragging')
      }
    }

    const dragOver = (e: any) => {
      setIsDragging(true)
      if (e.dataTransfer.types[0] === 'text/plain') {
        e.preventDefault()
      }
    }

    const drop = async (e: any) => {
      e.preventDefault()

      setIsDragging(false)

      const id = e.dataTransfer.getData('text/plain')
      const draggable = document.getElementById(id)

      if (
        !id ||
        !draggable ||
        !container ||
        draggable === e.target ||
        draggable.contains(e.target)
      )
        return

      const rect = e.target.getBoundingClientRect()

      const updatedY = e.clientY - rect.top

      const timingCellHeight = 50
      const minutesPerCell = 60
      const timingCellIndex = Math.floor(updatedY / timingCellHeight)

      const movedMinutes = timingCellIndex * minutesPerCell
      const movedHours = Math.floor(movedMinutes / 60)
      const movedMinutesRemainder = movedMinutes % 60

      const updatedX = e.clientX - rect.left
      const dayBoxIndex = Math.floor(updatedX / (rect.width / 7))

      const startDateCoords = new Date(currentDateState)
      startDateCoords.setDate(firstDateOfWeek.getDate() + dayBoxIndex)
      startDateCoords.setHours(movedHours, movedMinutesRemainder, 0, 0)

      const timingCellWidth = rect.width / 7
      const leftPosition = dayBoxIndex * timingCellWidth

      const endDateCoords = new Date(startDateCoords)
      endDateCoords.setMinutes(startDateCoords.getMinutes() + minutesPerCell)

      const options = {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      } as Intl.DateTimeFormatOptions

      const startHour = startDateCoords.toLocaleTimeString([], options)
      const endHour = endDateCoords.toLocaleTimeString([], options)

      const updatedTasks = tasks.map((task) => {
        if (task.id.toString() === id) {
          return {
            ...task,
            date: startDateCoords,
            startHour,
            endHour,
          }
        }
        return task
      })

      setTasks(updatedTasks)

      const taskToUpdate = tasks.find((task) => task.id === id)

      if (!taskToUpdate) return

      const updatedTask = {
        ...taskToUpdate,
        date: startDateCoords,
        startHour,
        endHour,
      }

      const response = await putDataRequest(url, updatedTask)

      if (response instanceof Error) {
        console.log(response.message)
      }

      if (draggable.className.includes('box')) {
        draggable.style.top = `${timingCellIndex * timingCellHeight + 10}px)`
        draggable.style.left = `${leftPosition}px`

        draggable.classList.remove('hide')
        e.target.appendChild(draggable)
      }
    }

    boxRefs.current.forEach((boxRef) => {
      if (boxRef) {
        boxRef.addEventListener('dragstart', dragStart)
        boxRef.addEventListener('dragend', dragEnd)
      }
    })

    container.addEventListener('dragover', dragOver)
    container.addEventListener('drop', drop)

    return () => {
      boxRefs.current.forEach((boxRef) => {
        if (boxRef) {
          boxRef.removeEventListener('dragstart', dragStart)
          boxRef.removeEventListener('dragend', dragEnd)
        }
      })
      container.removeEventListener('dragover', dragOver)
      container.removeEventListener('drop', drop)
    }
  }, [tasks, currentDateState])

  return (
    <>
      <div className="week-container">
        <div className="weekdays-container">
          <WeekDay
            weekDayNames={weekDayNames}
            firstDateOfWeek={firstDateOfWeek}
            lastDateOfWeek={lastDateOfWeek}
            isToday={isToday}
          />
        </div>
        <div className="timing-container">
          <Timings hours={hours} />
        </div>
        <div className="subgrid-weekdays-container" ref={containerRef}>
          {tasksWithPosition &&
            tasksWithPosition.map((task, index) => (
              <div
                key={task.id}
                className="box"
                draggable={true}
                ref={(ref) => (boxRefs.current[index] = ref)}
                id={task.id}
                style={{
                  top: task.top,
                  left: `${task.left}%`,
                }}
                onClick={() => {
                  setSelectedTask(task)
                  setShowUpdateForm((prev) => !prev)
                }}
              >
                <div>
                  {task.name.length > 10
                    ? `${task.name.substring(0, 10).concat('...')}`
                    : task.name}
                </div>
                <div>
                  {task.startHour}&nbsp;-&nbsp;{task.endHour}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}
