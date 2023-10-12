import { useState } from 'react'
import { Task } from './Types'

export const hours = Array.from({ length: 24 }, (v, i) => i)

export const dayNames: string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const weekDayNames: string[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const months: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const today: Date = new Date()

export const todayNumber: number = today.getDay()

export const getDayName = (date: Date): string => {
  const currentDate: Date = new Date(date)
  const currentDayIndex: number = currentDate.getDay()
  const dayName = dayNames[currentDayIndex]
  return dayName
}

export const getMonthDayNumber = (d: Date): number => {
  const currentDate: Date = new Date(d)
  const monthDay: number = currentDate.getDate()
  return monthDay
}

export const isToday = (dateToCheck: Date): boolean => {
  return (
    dateToCheck.getFullYear() === today.getFullYear() &&
    dateToCheck.getMonth() === today.getMonth() &&
    dateToCheck.getDay() === today.getDay() &&
    dateToCheck.getDate() === today.getDate()
  )
}

export const getFirstDateOfWeek = (d: Date = new Date()): Date => {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  const newDate = new Date(date.setDate(diff))
  newDate.setHours(0, 0, 0, 0)
  return newDate
}

export const getLastDateOfWeek = (d: Date) => {
  const lastDateOfWeek = new Date(d)
  const lastDayOfWeek = d.getDay() === 0 ? 6 : d.getDay() - 1
  lastDateOfWeek.setDate(d.getDate() + (6 - lastDayOfWeek))
  lastDateOfWeek.setHours(23, 59, 59, 999)
  return lastDateOfWeek
}

export const getPreviousDay = (currentDate: Date) => {
  const previousDay = new Date(currentDate)
  previousDay.setDate(previousDay.getDate() - 1)
  return previousDay
}

export const getNextDay = (currentDate: Date) => {
  const nextDay = new Date(currentDate)
  nextDay.setDate(nextDay.getDate() + 1)
  return nextDay
}

export const getPreviousWeek = (currentDate: Date) => {
  const dateCopy = new Date(currentDate.getTime())
  const peviousMonday = new Date(
    dateCopy.setDate(
      dateCopy.getDate() - ((7 - dateCopy.getDay() + 1) % 7 || 7),
    ),
  )
  return peviousMonday
}

export const getNextWeek = (date: Date = new Date()) => {
  const dateCopy = new Date(date.getTime())
  const nextMonday = new Date(
    dateCopy.setDate(
      dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7),
    ),
  )
  return nextMonday
}

export const getviewType = () => {
  const currentPath = window.location.pathname
  if (currentPath === '/day') {
    return 'day'
  } else if (currentPath === '/week') {
    return 'week'
  } else if (currentPath === '/month') {
    return 'month'
  }
  return 'day'
}

export const useCurrentDateState = () => {
  const initialDate = new Date(today)
  initialDate.setHours(0, 0, 0, 0)
  const [currentDateState, setCurrentDateState] = useState<Date>(initialDate)
  return { currentDateState, setCurrentDateState }
}

export const filterTasksForCurrentDay = (tasks: Task[], currentDate: Date) => {
  const currentDateStart = new Date(currentDate)
  currentDateStart.setHours(0, 0, 0, 0)

  const currentDateEnd = new Date(currentDate)
  currentDateEnd.setHours(23, 59, 59, 999)

  return tasks.filter((task) => {
    const taskDate = new Date(task.date)
    return taskDate >= currentDateStart && taskDate <= currentDateEnd
  })
}

export const filterTasksForCurrentWeek = (
  tasks: Task[],
  startDate: Date,
  endDate: Date,
) => {
  return tasks.filter((task) => {
    const taskDate = new Date(task.date)
    return taskDate >= startDate && taskDate <= endDate
  })
}

export const calculateTime = (
  e: any,
  timingCellHeight = 50,
  minutesPerCell = 60,
) => {
  const rect = e.target.getBoundingClientRect()

  const updatedY = e.clientY - rect.top

  const timingCellIndex = Math.floor(updatedY / timingCellHeight)

  const movedMinutes = timingCellIndex * minutesPerCell
  const movedHours = Math.floor(movedMinutes / 60)
  const movedMinutesRemainder = movedMinutes % 60

  const updatedX = e.clientX - rect.left
  const dayBoxIndex = Math.floor(updatedX / (rect.width / 7))

  return {
    rect,
    timingCellIndex,
    dayBoxIndex,
    movedMinutes,
    movedHours,
    movedMinutesRemainder,
    minutesPerCell,
    timingCellHeight,
  }
}

export const calculateTopPosition = (
  taskStartTime: string,
  timingCellHeight = 50,
  minutesPerCell = 60,
) => {
  if (taskStartTime) {
    const [hours, minutes] = taskStartTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes

    const timingCellIndex = Math.floor(totalMinutes / minutesPerCell)

    return timingCellIndex * timingCellHeight + 29
  }
}

export const calculateLeftPosition = (taskDate: Date) => {
  const dayIndex = (taskDate.getDay() + 6) % 7

  const cellWidth = 100 / 7
  const leftCoords = dayIndex * cellWidth
  return leftCoords
}

export const convertUTCDateToLocalTime = (task: Task) => {
  const utcTimeStamp = task.date
  const date = new Date(utcTimeStamp)
  return {
    ...task,
    date: date,
  }
}
