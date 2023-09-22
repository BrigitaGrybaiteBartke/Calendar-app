import React from 'react'
import '../../App.css'
import Timings from '../timings/Timings'
import WeekDay from './WeekDayPageHeader'
import {
  convertToUTCDateObject,
  filterTasksForCurrentDate,
  getFirstDateOfWeek,
  getLastDateOfWeek,
  hours,
  weekDayNames,
} from '../../utils/Utils'
import './WeekDayPage.css'
import { useEffect, useRef, useState } from 'react'

interface Task {
  id: string
  name: string
  date: Date
  startHour: string
  endHour: string
}

type TasksWithPosition = Task & {
  top: number
  left: string
}

interface WeekDayPageProps {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  currentDateState: Date
  isToday: (dateToCheck: Date) => boolean
}

export default function WeekDayPage({
  tasks,
  setTasks,
  currentDateState,
  isToday,
}: WeekDayPageProps) {
  const firstDateOfWeek = getFirstDateOfWeek(currentDateState)
  const lastDateOfWeek = getLastDateOfWeek(currentDateState)

  const containerRef = useRef<HTMLDivElement>(null)
  const boxRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const currentTasks = filterTasksForCurrentDate(
    tasks,
    firstDateOfWeek,
    lastDateOfWeek,
  )

  const calculateTopPosition = (taskStartTime: string, dayIndex: number) => {
    const [hours, minutes] = taskStartTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes

    const timingCellHeight = 50
    const minutesPerCell = 60
    const timingCellIndex = Math.floor(totalMinutes / minutesPerCell)

    return timingCellIndex * timingCellHeight + 10
  }

  const calculateLeftPosition = (taskDate: Date) => {
    const dayIndex = (taskDate.getDay() + 6) % 7

    const cellWidth = 100 / 7
    const leftCoords = dayIndex * cellWidth
    return `${leftCoords}%`
  }

  const tasksWithPosition: TasksWithPosition[] = currentTasks.map((task) => ({
    ...task,
    top: calculateTopPosition(task.startHour, new Date(task.date).getDay()),
    left: calculateLeftPosition(new Date(task.date)),
  }))

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

    const drop = (e: any) => {
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

      const updatedX = e.clientX - rect.left
      const dayBoxIndex = Math.floor(updatedX / (rect.width / 7))

      const startDateCoords = new Date(currentDateState)
      startDateCoords.setDate(firstDateOfWeek.getDate() + dayBoxIndex)
      startDateCoords.setHours(movedHours, movedMinutesRemainder, 0, 0)

      const utcDate = convertToUTCDateObject(startDateCoords)

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
            date: utcDate,
            startHour,
            endHour,
          }
        }
        return task
      })

      setTasks(updatedTasks)

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
  }, [tasks, currentDateState, currentTasks])

  return (
    <>
      <div className="content-grid">
        <div className="week-container">
          <div className="vertical-line vertical-line-1"></div>
          <div className="vertical-line vertical-line-2"></div>
          <div className="vertical-line vertical-line-3"></div>
          <div className="vertical-line vertical-line-4"></div>
          <div className="vertical-line vertical-line-5"></div>
          <div className="vertical-line vertical-line-6"></div>
          <div className="vertical-line vertical-line-7"></div>

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
              tasksWithPosition.map(
                (task, index) =>
                  containerRef.current && (
                    <>
                      {/* {console.log(
                        ((new Date(task.date).getDay() + 6) % 7) * (100 / 7),
                      )} */}
                      {/* //gaunama savaites diena, atsizvelgiant, kad pirma diena
                      // yra pirmadienis, o ne sekmadienis */}
                      <div
                        key={task.id}
                        className="box"
                        draggable={true}
                        ref={(ref) => (boxRefs.current[index] = ref)}
                        id={task.id}
                        // style={{
                        //   top: calculateTopPosition(
                        //     task.startHour,
                        //     new Date(task.date).getDay(),
                        //   ),
                        //   left: `${
                        //     ((new Date(task.date).getDay() + 6) % 7) * (100 / 7)
                        //   }%`,
                        // }}
                        style={{
                          top: task.top,
                          left: task.left,
                        }}
                      >
                        <div>
                          {task.name.length > 10
                            ? `${task.name.substring(0, 10).concat('...')}`
                            : task.name}
                        </div>
                        <div>
                          {task.date instanceof Date ?? task.date.toString()}
                        </div>
                        <div>
                          {task.startHour}&nbsp;-&nbsp;{task.endHour}
                        </div>
                      </div>
                    </>
                  ),
              )}
          </div>
        </div>
      </div>
    </>
  )
}
