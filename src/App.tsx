import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import {
  convertUTCDateToLocalTime,
  filterTasksForCurrentDay,
  filterTasksForCurrentWeek,
  getFirstDateOfWeek,
  getLastDateOfWeek,
  getviewType,
  useCurrentDateState,
} from './utils/Utils'
import Navigation from './components/navigation/Navigation'
import './App.css'
import DayPage from './components/dayPage/DayPage'
import AddTaskForm from './components/taskAddForm/TaskAddForm'
import WeekPage from './components/weekPage/WeekPage'
import './components/taskAddForm/TaskAddForm.css'
import './components/taskUpdateForm/TaskUpdateForm.css'
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
import UpdateTaskForm from './components/taskUpdateForm/TaskUpdateForm'

export default function App() {
  const { currentDateState, setCurrentDateState } = useCurrentDateState()
  const [tasks, setTasks] = useState<Task[]>([])
  const [viewType, setViewType] = useState(getviewType())
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [error, setError] = useState<null | Error>(null)

  const firstDateOfWeek = getFirstDateOfWeek(currentDateState)
  const lastDateOfWeek = getLastDateOfWeek(currentDateState)

  const currentDayTasks = filterTasksForCurrentDay(tasks, currentDateState)

  const currentWeekTasks = filterTasksForCurrentWeek(
    tasks,
    firstDateOfWeek,
    lastDateOfWeek,
  )

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const response = await fetchDataRequest('http://localhost:8000/taskss')

        const tasksWithLocalTime = response.map((task: Task) =>
          convertUTCDateToLocalTime(task),
        )

        setTasks(tasksWithLocalTime)
      } catch (err) {
        setError(err as Error)
        console.error(error?.stack)
      }
    }

    fetchDataAsync()
  }, [viewType, currentDateState])

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await deleteDataRequest(url, taskId)

      const filteredTasks = tasks.filter((task) => task.id !== taskId)

      setTasks(filteredTasks)
      setShowUpdateForm((prev) => !prev)
    } catch (err) {
      setError(err as Error)
      console.error(error?.stack)
    }
  }

  const handleAddTask = async (newTask: Task, selectedDate: Date) => {
    try {
      const response = await postDataRequest(url, newTask)

      const taskWithLocalTime = convertUTCDateToLocalTime(response)

      setCurrentDateState(() => selectedDate)
      setTasks((prev) => [...prev, taskWithLocalTime])
      setShowAddForm((prev) => !prev)
    } catch (err) {
      setError(err as Error)
      console.error(error?.stack)
    }
  }

  const handleFormUpdateTask = async (updatedTask: Task, updatedDate: Date) => {
    try {
      const response = await putDataRequest(url, updatedTask)

      const taskWithLocalTime = convertUTCDateToLocalTime(response)

      const updatedTasks = tasks.map((task) => {
        return task.id === taskWithLocalTime.id ? taskWithLocalTime : task
      })

      setTasks(updatedTasks)
      setCurrentDateState(updatedDate)
      setShowUpdateForm((prev) => !prev)
    } catch (err) {
      setError(err as Error)
      console.error(error?.stack)
    }
  }

  const handleDropUpdateTask = async (updatedTask: Task, updatedDate: Date) => {
    try {
      const response = await putDataRequest(url, updatedTask)

      const taskWithLocalTime = convertUTCDateToLocalTime(response)

      const updatedTasks = tasks.map((task) => {
        return task.id === taskWithLocalTime.id ? taskWithLocalTime : task
      })
      setTasks(updatedTasks)
      setCurrentDateState(updatedDate)
    } catch (err) {
      setError(err as Error)
      console.error(error?.stack)
    }
  }

  const handleFormClose = (componentIdentifier: string) => {
    if (componentIdentifier === 'updateForm') {
      setShowUpdateForm((prev) => !prev)
    } else if (componentIdentifier === 'addForm') {
      setShowAddForm((prev) => !prev)
    }
  }

  const handleViewTypeChange = (viewType: string) => {
    if (viewType) {
      setViewType(viewType)
    }
  }
  return (
    <>
      {error ? (
        <div>
          {error.name}: {error.message}
        </div>
      ) : (
        <BrowserRouter>
          <div className="top-grid">
            <Navigation
              currentDateState={currentDateState}
              setCurrentDateState={setCurrentDateState}
              viewType={viewType}
              onViewTypeChange={handleViewTypeChange}
            />
          </div>
          <UpdateTaskForm
            showUpdateForm={showUpdateForm}
            selectedTask={selectedTask}
            onDelete={handleDeleteTask}
            onUpdate={handleFormUpdateTask}
            onClose={handleFormClose}
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
              currentDateState={currentDateState}
              showAddForm={showAddForm}
              onAdd={handleAddTask}
              onClose={handleFormClose}
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
                    currentDayTasks={currentDayTasks}
                    setSelectedTask={setSelectedTask}
                    setShowUpdateForm={setShowUpdateForm}
                    onUpdate={handleDropUpdateTask}
                  />
                }
              />
              <Route
                path="/week"
                element={
                  <WeekPage
                    currentDateState={currentDateState}
                    currentWeekTasks={currentWeekTasks}
                    setSelectedTask={setSelectedTask}
                    setShowUpdateForm={setShowUpdateForm}
                    onUpdate={handleDropUpdateTask}
                  />
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </>
  )
}
