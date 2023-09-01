import React, { useEffect, useState } from 'react'

interface Task {
  id: string
  name: string
  date: Date
  startHour: string
  endHour: string
}

interface AddTaskFormProps {
  handleAddTask?: (newTask: Task, selectedDate: Date) => void
  currentDateState: Date
}

export default function AddTaskForm({
  handleAddTask,
  currentDateState,
}: AddTaskFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(currentDateState)
  const [taskDetails, setTaskDetails] = useState({
    name: '',
    date: selectedDate,
    startHour: '',
    endHour: '',
  })

  useEffect(() => {
    setSelectedDate(currentDateState)
  }, [currentDateState])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    const { name, value } = e.target

    if (name === 'date') {
      const newSelectedDate = new Date(value)
      newSelectedDate.setHours(0, 0, 0, 0)

      setSelectedDate(newSelectedDate)

      setTaskDetails((prev) => ({
        ...prev,
        [name]: new Date(value),
      }))
    } else {
      setTaskDetails((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      !taskDetails.name ||
      !taskDetails.date ||
      !taskDetails.startHour ||
      !taskDetails.endHour
    ) {
      return
    }

    const newSelectedDate = new Date(selectedDate)
    const timeString = taskDetails.startHour
    const [hours, minutes] = timeString.split(':')

    const parsedHours = parseInt(hours)
    const parsedMinutes = parseInt(minutes)

    newSelectedDate.setHours(parsedHours, parsedMinutes, 0, 0)

    if (handleAddTask) {
      const newTask = {
        id: Date.now().toString(),
        name: taskDetails.name,
        date: newSelectedDate,
        startHour: taskDetails.startHour,
        endHour: taskDetails.endHour,
      }

      handleAddTask(newTask, newSelectedDate)
    }

    setTaskDetails({
      name: '',
      date: selectedDate,
      startHour: '',
      endHour: '',
    })
  }

  return (
    <>
      <div className="side-grid">
        <form onSubmit={handleFormSubmit} className="form">
          <div className="input-container">
            <input
              type="text"
              name="name"
              placeholder="Enter task..."
              onChange={handleInputChange}
              value={taskDetails.name}
              // required
            />
          </div>

          <div className="input-container">
            <label>Start Date:</label>
            <input
              type="date"
              name="date"
              onChange={handleInputChange}
              // value={selectedDate.toISOString().split("T")[0]}
              // required
            />
          </div>
          <div className="input-container">
            <label>Start Hour:</label>
            <input
              type="time"
              name="startHour"
              onChange={(e) => {
                handleInputChange(e)
              }}
              value={taskDetails.startHour}
              // required
            />
          </div>
          <div className="input-container">
            <label>End Hour:</label>
            <input
              type="time"
              name="endHour"
              onChange={handleInputChange}
              value={taskDetails.endHour}
              //   required
            />
          </div>
          <button type="submit" className="submit-button">
            Add
          </button>
        </form>
      </div>
    </>
  )
}
