import { useEffect, useRef, useState } from 'react'
import Timings from '../timings/Timings'
import DayPageHeader from './DayPageHeader'
import {
  calculateTime,
  calculateTopPosition,
  getDayName,
  getMonthDayNumber,
  hours,
} from '../../utils/Utils'
import '../dayPage/DayPage.css'
import '../timings/Timings.css'
import { DayPageProps, TasksWithPosition } from '../../utils/Types'

export default function DayPage({
  currentDateState,
  currentDayTasks,
  setSelectedTask,
  setShowUpdateForm,
  onUpdate,
}: DayPageProps) {
  const dayName = getDayName(currentDateState)
  const monthDay = getMonthDayNumber(currentDateState)
  const containerRef = useRef<HTMLDivElement>(null)
  const boxRefs = useRef<(HTMLDivElement | null)[]>([])

  const [isDragging, setIsDragging] = useState(false)

  const tasksWithPosition: TasksWithPosition[] = currentDayTasks.map((task) => {
    const top = calculateTopPosition(task.startHour)

    if (typeof top === 'number') {
      return {
        ...task,
        top,
        left: 0,
      }
    } else {
      return {
        ...task,
        top: 0,
        left: 0,
      }
    }
  })

  useEffect(() => {
    if (!containerRef.current || !boxRefs.current) return

    const container = containerRef.current
    const boxs = boxRefs.current

    const dragStart = (e: DragEvent) => {
      setIsDragging(true)

      const targetElement = e.target as HTMLDivElement | null

      if (targetElement && targetElement.className.includes('box')) {
        targetElement.classList.add('dragging')
        if (e.dataTransfer) {
          e.dataTransfer.setData('text/plain', targetElement.id)
        }
      }

      setTimeout(() => {
        if (targetElement) targetElement.classList.add('hide')
      }, 0)
    }

    const dragEnd = (e: DragEvent) => {
      setIsDragging(false)

      const targetElement = e.target as HTMLDivElement | null

      if (targetElement && targetElement.className.includes('box')) {
        targetElement.classList.remove('dragging')
      }
    }

    const dragOver = (e: DragEvent) => {
      setIsDragging(true)

      if (e.dataTransfer?.types[0] === 'text/plain') {
        e.preventDefault()
      }
    }

    const drop = async (e: DragEvent) => {
      e.preventDefault()

      setIsDragging(false)

      const id = e.dataTransfer?.getData('text/plain')

      if (!id) return

      const draggable = document.getElementById(id)

      if (
        !id ||
        !draggable ||
        !container ||
        draggable === e.target ||
        draggable.contains(e.target as Node)
      )
        return

      const {
        movedHours,
        movedMinutesRemainder,
        minutesPerCell,
        timingCellIndex,
        timingCellHeight,
      } = calculateTime(e)

      const startDateCoords = new Date(currentDateState)
      startDateCoords.setHours(movedHours, movedMinutesRemainder, 0, 0)

      const endDateCoords = new Date(startDateCoords)
      endDateCoords.setMinutes(startDateCoords.getMinutes() + minutesPerCell)

      const options = {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      } as Intl.DateTimeFormatOptions

      const startHour = startDateCoords.toLocaleTimeString([], options)
      const endHour = endDateCoords.toLocaleTimeString([], options)

      const taskToUpdate = currentDayTasks.find((task) => task.id === id)
      if (!taskToUpdate) return

      const updatedTask = {
        ...taskToUpdate,
        date: startDateCoords,
        startHour,
        endHour,
      }

      onUpdate(updatedTask, startDateCoords)

      if (
        e.target instanceof HTMLElement &&
        draggable.className.includes('box')
      ) {
        draggable.style.top = `${timingCellIndex * timingCellHeight + 29}px)`
        draggable.classList.remove('hide')
        e.target.appendChild(draggable)
      }
    }

    boxs.forEach((box) => {
      if (box) {
        box.addEventListener('dragstart', dragStart)
        box.addEventListener('dragend', dragEnd)
      }
    })

    container.addEventListener('dragover', dragOver)
    container.addEventListener('drop', drop)

    return () => {
      boxs.forEach((box) => {
        if (box) {
          box.removeEventListener('dragstart', dragStart)
          box.removeEventListener('dragend', dragEnd)
        }
      })

      container.removeEventListener('dragover', dragOver)
      container.removeEventListener('drop', drop)
    }
  }, [currentDayTasks, currentDateState])

  return (
    <>
      <div className="day-container">
        <div className="single-day">
          <DayPageHeader
            dayName={dayName}
            monthDay={monthDay}
            currentDateState={currentDateState}
          />
        </div>
        <div className="timing-container">
          <Timings hours={hours} />
        </div>
        <div className="subgrid-single-day-container" ref={containerRef}>
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
