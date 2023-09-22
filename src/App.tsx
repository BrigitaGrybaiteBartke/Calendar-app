import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import {
  convertToUTCDateObject,
  getNextWeek,
  getPreviousWeek,
  getviewType,
  today,
  useCurrentDateState,
} from './utils/Utils'
import Navigation from './components/navigation/Navigation'
import './App.css'
import SingleDayPage from './components/dayPage/SingleDayPage'
import AddTaskForm from './components/taskAddForm/TaskAddForm'
import WeekDayPage from './components/weekPage/WeekDayPage'
import './components/taskAddForm/TaskAddForm.css'
import './components/taskUpdateForm/TaskUpdateForm.css'
import TaskUpdateForm from './components/taskUpdateForm/TaskUpdateForm'

interface Task {
  id: string
  name: string
  date: Date
  startHour: string
  endHour: string
}

export default function App() {
  const { currentDateState, setCurrentDateState } = useCurrentDateState()
  const [tasks, setTasks] = useState<Task[]>([])
  const [viewType, setViewType] = useState(getviewType())

  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const url = 'http://localhost:8000/tasks'

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }

        const data = await response.json()

        console.log(data)
        const tasksWithLocalTime = data.map((task: Task) => {
          const utcTimeStamp = task.date

          const date = new Date(utcTimeStamp)

          const localTime = date.toString()

          return {
            ...task,
            date: localTime,
          }
        })

        setTasks(tasksWithLocalTime)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
  }, [viewType])

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${url}/${taskId}`, {
        method: 'DELETE',
      })
      const filteredTasks = tasks.filter((task) => task.id !== taskId)
      setTasks(filteredTasks)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(`${url}/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      })
      if (!response.ok) {
        throw new Error('Failed to update task on the server')
      }

      const updatedTasks = tasks.map((task) => {
        return task.id === updatedTask.id ? updatedTask : task
      })

      setTasks(updatedTasks)
      setSelectedTask(updatedTask)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddTask = (newTask: Task, selectedDate: Date) => {
    const timeString = newTask.startHour

    const [hours, minutes] = timeString.split(':')
    const parsedHours = parseInt(hours)
    const parsedMinutes = parseInt(minutes)

    const newSelectedDate = new Date(selectedDate)
    newSelectedDate.setHours(parsedHours, parsedMinutes, 0, 0)

    const utcDate = convertToUTCDateObject(newSelectedDate)

    const updatedTask = {
      ...newTask,
      date: utcDate,
    }

    setCurrentDateState(new Date(selectedDate))

    setTasks((prevTasks) => [...prevTasks, updatedTask])
  }

  const handleViewTypeChange = (viewType: string) => {
    if (viewType) {
      setViewType(viewType)
    }
  }

  const handleBackwardButton = () => {
    if (viewType === 'day') {
      const previousDate = new Date(currentDateState)
      previousDate.setDate(previousDate.getDate() - 1)
      setCurrentDateState(previousDate)
    } else if (viewType === 'week') {
      const nextWeek = getPreviousWeek(currentDateState)
      setCurrentDateState(nextWeek)
    }
  }

  const handleForwardButton = () => {
    if (viewType === 'day') {
      const nextDate = new Date(currentDateState)
      nextDate.setDate(nextDate.getDate() + 1)
      setCurrentDateState(nextDate)
    } else if (viewType === 'week') {
      const nextWeek = getNextWeek(currentDateState)
      setCurrentDateState(nextWeek)
    }
  }

  const isToday = (dateToCheck: Date) => {
    return (
      dateToCheck.getFullYear() === today.getFullYear() &&
      dateToCheck.getMonth() === today.getMonth() &&
      dateToCheck.getDay() === today.getDay() &&
      dateToCheck.getDate() === today.getDate()
    )
  }

  return (
    <>
      <BrowserRouter>
        <Navigation
          currentDateState={currentDateState}
          setCurrentDateState={setCurrentDateState}
          handleBackwardButton={handleBackwardButton}
          handleForwardButton={handleForwardButton}
          viewType={viewType}
          handleViewTypeChange={handleViewTypeChange}
        />
        <TaskUpdateForm
          showUpdateForm={showUpdateForm}
          onRequestClose={() => {
            setShowUpdateForm((prev) => !prev)
          }}
          selectedTask={selectedTask}
          onDelete={handleDeleteTask}
          onUpdate={handleUpdateTask}
        />
        <div className="side-grid">
          <AddTaskForm
            onAddTask={handleAddTask}
            currentDateState={currentDateState}
          />
        </div>
        <Routes>
          <Route path="/" element={<Navigate to="/day" />} />
          <Route
            path="/day"
            element={
              <SingleDayPage
                currentDateState={currentDateState}
                tasks={tasks}
                setTasks={setTasks}
                isToday={isToday}
                setShowUpdateForm={setShowUpdateForm}
                setSelectedTask={setSelectedTask}
              />
            }
          />
          <Route
            path="/week"
            element={
              <WeekDayPage
                currentDateState={currentDateState}
                tasks={tasks}
                setTasks={setTasks}
                isToday={isToday}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}
