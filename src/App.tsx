import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import {
  filterTasksForCurrentDay,
  filterTasksForCurrentWeek,
  getFirstDateOfWeek,
  getLastDateOfWeek,
  getNextWeek,
  getPreviousWeek,
  getviewType,
  today,
  useCurrentDateState,
} from './utils/Utils'
import Navigation from './components/navigation/Navigation'
import './App.css'
import DayPage from './components/dayPage/DayPage'
import AddTaskForm from './components/taskAddForm/TaskAddForm'
import WeekPage from './components/weekPage/WeekPage'
import './components/taskAddForm/TaskAddForm.css'
import './components/taskUpdateForm/TaskUpdateForm.css'
import TaskUpdateForm from './components/taskUpdateForm/TaskUpdateForm'
import {
  deleteDataRequest,
  fetchDataRequest,
  postDataRequest,
  putDataRequest,
  url,
} from './utils/Api'
import './assets/Form.css'
import './assets/TaskBox.css'
import './assets/DividingLines.css'
import { Task } from './utils/Types'
import { TfiPlus } from 'react-icons/tfi'

export default function App() {
  const { currentDateState, setCurrentDateState } = useCurrentDateState()
  const [tasks, setTasks] = useState<Task[]>([])
  const [viewType, setViewType] = useState(getviewType())

  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const currentDayTasks = filterTasksForCurrentDay(tasks, currentDateState)
  const firstDateOfWeek = getFirstDateOfWeek(currentDateState)
  const lastDateOfWeek = getLastDateOfWeek(currentDateState)

  const currentWeekTasks = filterTasksForCurrentWeek(
    tasks,
    firstDateOfWeek,
    lastDateOfWeek,
  )

  useEffect(() => {
    const fetchDataAsync = async () => {
      const response = await fetchDataRequest(url)

      if (response instanceof Error) {
        console.log(response.message)
      }

      setTasks(response)
      return response
    }

    fetchDataAsync()
  }, [viewType, currentDateState])

  const handleDeleteTask = async (taskId: string) => {
    const response = await deleteDataRequest(url, taskId)

    if (response instanceof Error) {
      console.log(response.message)
    }

    const filteredTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(filteredTasks)
  }

  const handleAddTask = async (newTask: Task, selectedDate: Date) => {
    const response = await postDataRequest(url, newTask)

    if (response instanceof Error) {
      console.log(response.message)
    }

    const taskWithLocalTime = {
      ...response,
      date: new Date(response.date),
    }

    setCurrentDateState(() => selectedDate)
    setTasks((prev) => [...prev, taskWithLocalTime])
  }

  const handleUpdateTask = async (updatedTask: Task, updatedDate: Date) => {
    const response = await putDataRequest(url, updatedTask)

    if (response instanceof Error) {
      console.log(response.message)
    }

    const taskWithLocalTime = {
      ...response,
      date: new Date(response.date),
    }

    const updatedTasks = tasks.map((task) => {
      return task.id === taskWithLocalTime.id ? taskWithLocalTime : task
    })

    setTasks(updatedTasks)
    setCurrentDateState(updatedDate)
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
        <div className="top-grid">
          <Navigation
            currentDateState={currentDateState}
            setCurrentDateState={setCurrentDateState}
            handleBackwardButton={handleBackwardButton}
            handleForwardButton={handleForwardButton}
            viewType={viewType}
            handleViewTypeChange={handleViewTypeChange}
          />
        </div>
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
          <button
            type="submit"
            className="side-add-btn"
            onClick={() => setShowAddForm((prev) => !prev)}
          >
            <TfiPlus />
            <span className="side-btn-text">add</span>
          </button>

          <AddTaskForm
            showAddForm={showAddForm}
            onRequestClose={() => {
              setShowAddForm((prev) => !prev)
            }}
            onAddTask={handleAddTask}
            currentDateState={currentDateState}
          />
        </div>
        <div className="content-grid">
          <Routes>
            <Route path="/" element={<Navigate to="/day" />} />
            <Route
              path="/day"
              element={
                <DayPage
                  currentDateState={currentDateState}
                  tasks={tasks}
                  setTasks={setTasks}
                  isToday={isToday}
                  setShowUpdateForm={setShowUpdateForm}
                  setSelectedTask={setSelectedTask}
                  currentDayTasks={currentDayTasks}
                />
              }
            />
            <Route
              path="/week"
              element={
                <WeekPage
                  currentDateState={currentDateState}
                  tasks={tasks}
                  setTasks={setTasks}
                  isToday={isToday}
                  currentWeekTasks={currentWeekTasks}
                  setShowUpdateForm={setShowUpdateForm}
                  setSelectedTask={setSelectedTask}
                />
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}
