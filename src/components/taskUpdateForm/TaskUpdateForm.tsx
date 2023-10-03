import { useEffect, useState } from 'react'
import { Task, TaskUpdateFormProps } from '../../utils/Types'
import '../taskUpdateForm/TaskUpdateForm.css'
import { TfiTrash } from 'react-icons/tfi'
import { TfiClose } from 'react-icons/tfi'
import { TfiCheck } from 'react-icons/tfi'

export default function TaskUpdateForm({
  selectedTask,
  showUpdateForm,
  onRequestClose,
  onDelete,
  onUpdate,
}: TaskUpdateFormProps) {
  const [updatedTaskDetails, setUpdatedTaskDetails] = useState<Task>({
    id: '',
    name: '',
    date: new Date(),
    startHour: '',
    endHour: '',
  })

  useEffect(() => {
    if (selectedTask) {
      setUpdatedTaskDetails({ ...selectedTask })
    } else {
      setUpdatedTaskDetails({
        id: '',
        name: '',
        date: new Date(),
        startHour: '',
        endHour: '',
      })
    }
  }, [selectedTask])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    const { name, value } = e.target

    if (name === 'date') {
      const inputSelectedDate = new Date(value)

      inputSelectedDate.setHours(0, 0, 0, 0)

      setUpdatedTaskDetails((prev) => ({
        ...prev,
        date: inputSelectedDate,
      }))
    } else {
      setUpdatedTaskDetails((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      !updatedTaskDetails.name ||
      !updatedTaskDetails.date ||
      !updatedTaskDetails.startHour ||
      !updatedTaskDetails.endHour
    ) {
      return
    }

    const newUpdatedDate = new Date(updatedTaskDetails.date)

    const timeString = updatedTaskDetails.startHour
    const [hours, minutes] = timeString.split(':')
    const parsedHours = parseInt(hours)
    const parsedMinutes = parseInt(minutes)

    newUpdatedDate.setHours(parsedHours, parsedMinutes, 0, 0)

    if (selectedTask && updatedTaskDetails) {
      const updatedTask = {
        id: selectedTask.id,
        name: updatedTaskDetails.name,
        date: newUpdatedDate,
        startHour: updatedTaskDetails.startHour,
        endHour: updatedTaskDetails.endHour,
      }

      console.log(updatedTask)

      onUpdate(updatedTask, newUpdatedDate)

      onRequestClose()
    }
  }

  const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    selectedTask && onDelete(selectedTask.id)
    onRequestClose()
  }

  return showUpdateForm ? (
    <>
      <div className="modal">
        <div className="modal-content">
          <button
            className="close-btn"
            onClick={() => {
              onRequestClose()
            }}
          >
            <TfiClose />
          </button>

          <form onSubmit={handleUpdate} className="form">
            <div className="input-container">
              <input
                type="text"
                name="name"
                placeholder="Edit task..."
                onChange={handleInputChange}
                value={updatedTaskDetails.name}
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
                onChange={handleInputChange}
                value={updatedTaskDetails.startHour}
                // required
              />
            </div>
            <div className="input-container">
              <label>End Hour:</label>
              <input
                type="time"
                name="endHour"
                onChange={handleInputChange}
                value={updatedTaskDetails.endHour}
                //   required
              />
            </div>
            <div className="action-btn">
              <button type="submit" className="update-btn">
                <TfiCheck />
                <span className="btn-text">update</span>
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={(e) => {
                  e.preventDefault()
                  onRequestClose()
                }}
              >
                <TfiClose />
                <span className="btn-text">cancel</span>
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={handleDelete}
              >
                <TfiTrash />
                <span className="btn-text">delete</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  ) : null
}
