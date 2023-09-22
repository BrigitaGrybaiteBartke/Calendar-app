import React, { useState } from 'react'

interface Task {
  id: string
  name: string
  date: Date
  startHour: string
  endHour: string
}

interface TaskAddFormProps {
  onAddTask?: (newTask: Task, selectedDate: Date) => void
  currentDateState: Date
}

export default function TaskAddForm({
  onAddTask,
  currentDateState,
}: TaskAddFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(currentDateState)

  const [taskDetails, setTaskDetails] = useState({
    name: '',
    date: selectedDate,
    startHour: '',
    endHour: '',
  })

  const url = 'http://localhost:8000/tasks'

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const taskData = {
      id: Date.now().toString(),
      name: taskDetails.name,
      date: newSelectedDate.toISOString(),
      startHour: taskDetails.startHour,
      endHour: taskDetails.endHour,
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (onAddTask) {
        const newTask = {
          id: Date.now().toString(),
          name: taskDetails.name,
          date: newSelectedDate,
          startHour: taskDetails.startHour,
          endHour: taskDetails.endHour,
        }

        onAddTask(newTask, newSelectedDate)
      }

      setTaskDetails({
        name: '',
        date: selectedDate,
        startHour: '',
        endHour: '',
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="form-add">
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
    </>
  )
}
