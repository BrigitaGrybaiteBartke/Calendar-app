import React, { useEffect, useRef, useState } from 'react'
import SingleDayPageHeader from './SingleDayPageHeader'
import Timings from '../timings/Timings'
import {
  convertToUTCDateObject,
  filterTasksForCurrentDate,
  getDayName,
  getMonthDayNumber,
  hours,
} from '../../utils/Utils'
import '../timings/Timings.css'
import '../dayPage/SingleDayPage.css'

interface Task {
  id: string
  name: string
  date: Date
  startHour: string
  endHour: string
}

type TasksWithPosition = Task & {
  top: number
  left: number
}

interface SingleDayPageProps {
  currentDateState: Date
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  isToday: (dateToCheck: Date) => boolean
  setShowUpdateForm: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>
}

export default function SingleDayPage({
  currentDateState,
  tasks,
  setTasks,
  isToday,
  setShowUpdateForm,
  setSelectedTask,
}: SingleDayPageProps) {
  const dayName = getDayName(currentDateState)
  const monthDay = getMonthDayNumber(currentDateState)
  const containerRef = useRef<HTMLDivElement>(null)
  const boxRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const url = 'http://localhost:8000/tasks'

  const copiedCurrentDateState = new Date(currentDateState.getTime())
  const setLastTimeOfCurrentDay = copiedCurrentDateState.setHours(
    23,
    59,
    59,
    999,
  )
  const lastTimeOfCurrentDay = new Date(setLastTimeOfCurrentDay)

  const currentTasks = filterTasksForCurrentDate(
    tasks,
    currentDateState,
    lastTimeOfCurrentDay,
  )

  const calculateTopPosition = (taskStartTime: string, dayIndex: number) => {
    const [hours, minutes] = taskStartTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes

    const timingCellHeight = 50
    const minutesPerCell = 60
    const timingCellIndex = Math.floor(totalMinutes / minutesPerCell)

    return timingCellIndex * timingCellHeight + 10
  }

  const tasksWithPosition: TasksWithPosition[] = currentTasks.map((task) => ({
    ...task,
    top: calculateTopPosition(task.startHour, new Date(task.date).getDay()),
    left: 0,
  }))

  useEffect(() => {
    if (!containerRef.current || !boxRefs.current) return

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

      if (!id || !draggable || !container) return

      const rect = e.target.getBoundingClientRect()

      const updatedY = e.clientY - rect.top

      const timingCellHeight = 50
      const minutesPerCell = 60
      const timingCellIndex = Math.floor(updatedY / timingCellHeight)

      const movedMinutes = timingCellIndex * minutesPerCell
      const movedHours = Math.floor(movedMinutes / 60)
      const movedMinutesRemainder = movedMinutes % 60

      const newTopPosition =
        Math.floor(updatedY / timingCellHeight) * timingCellHeight

      const startDateCoords = new Date(currentDateState)
      startDateCoords.setHours(movedHours, movedMinutesRemainder, 0, 0)

      const utcDate = convertToUTCDateObject(startDateCoords)

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
            date: utcDate,
            startHour,
            endHour,
            top: newTopPosition,
          }
        }
        return task
      })

      setTasks(updatedTasks)

      const updatedTask = tasks.find((task) => task.id.toString() === id)

      try {
        const response = await fetch(`${url}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        })

        if (!response.ok) {
          throw new Error('Failed to update task on the server')
        }
      } catch (error) {
        console.error(error)
      }

      if (draggable.className.includes('box')) {
        draggable.style.top = `${timingCellIndex * timingCellHeight + 10}px)`
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
      <div className="content-grid">
        <div className="day-container">
          <div className="vertical-line vertical-line-1"></div>
          <div className="single-day">
            <SingleDayPageHeader
              dayName={dayName}
              monthDay={monthDay}
              isToday={isToday}
              currentDateState={currentDateState}
            />
          </div>
          <div className="timing-container">
            <Timings hours={hours} />
          </div>
          <div
            className="subgrid-single-day-container grid-view"
            ref={containerRef}
          >
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
                    left: task.left,
                  }}
                  onClick={() => {
                    setSelectedTask(task)
                    setShowUpdateForm((prev) => !prev)
                  }}
                >
                  <div>
                    {task.name.length > 90
                      ? `${task.name.substring(0, 90).concat('...')}`
                      : task.name}
                  </div>

                  <div>{task.date.toString()}</div>
                  <div>
                    {task.startHour}&nbsp;-&nbsp;{task.endHour}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}
