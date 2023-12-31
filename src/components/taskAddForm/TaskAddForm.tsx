import React, { useState } from 'react'
import '../taskAddForm/TaskAddForm.css'
import { TfiClose } from 'react-icons/tfi'
import { TfiCheck } from 'react-icons/tfi'
import { AddTaskFormProps } from '../../utils/Types'

export default function AddTaskForm({
  currentDateState,
  showAddForm,
  onAdd,
  onClose,
}: AddTaskFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(currentDateState)

  const [taskDetails, setTaskDetails] = useState({
    name: '',
    date: selectedDate,
    startHour: '',
    endHour: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    const { name, value } = e.target

    if (name === 'date') {
      const inputSelectedDate = new Date(value)

      inputSelectedDate.setHours(0, 0, 0, 0)
      setSelectedDate(inputSelectedDate)

      setTaskDetails((prev) => ({
        ...prev,
        [name]: selectedDate,
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

    const timeString = taskDetails.startHour
    const [hours, minutes] = timeString.split(':')
    const parsedHours = parseInt(hours)
    const parsedMinutes = parseInt(minutes)

    const newSelectedDate = new Date(selectedDate)
    newSelectedDate.setHours(parsedHours, parsedMinutes, 0, 0)

    if (onAdd) {
      const newTask = {
        id: Date.now().toString(),
        name: taskDetails.name,
        date: newSelectedDate,
        startHour: taskDetails.startHour,
        endHour: taskDetails.endHour,
      }

      onAdd(newTask, newSelectedDate)
    }

    setTaskDetails({
      name: '',
      date: selectedDate,
      startHour: '',
      endHour: '',
    })
  }

  const handleClose = (componentIdentifier: string) => {
    setTaskDetails({
      name: '',
      date: selectedDate,
      startHour: '',
      endHour: '',
    })

    onClose(componentIdentifier)
  }

  return showAddForm ? (
    <>
      <div className="modal">
        <div className="modal-content">
          <button className="close-btn" onClick={() => handleClose('addForm')}>
            <TfiClose />
          </button>
          <form onSubmit={handleSubmit} className="form">
            <div className="input-container">
              <input
                type="text"
                name="name"
                placeholder="Enter task..."
                onChange={handleInputChange}
                value={taskDetails.name}
                required
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
                required
              />
            </div>
            <div className="input-container">
              <label>End Hour:</label>
              <input
                type="time"
                name="endHour"
                onChange={handleInputChange}
                value={taskDetails.endHour}
                required
              />
            </div>
            <div className="action-btn">
              <button type="submit" className="add-btn">
                <TfiCheck />
                <span className="btn-text">add</span>
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => handleClose('addForm')}
              >
                <TfiClose />
                <span className="btn-text">cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  ) : null
}
