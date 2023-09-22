import { useEffect, useState } from 'react'
import '../Modal.css'

interface Task {
  id: string
  name: string
  date: Date
  startHour: string
  endHour: string
}

interface TaskUpdateFormProps {
  showUpdateForm: boolean
  onRequestClose: () => void
  selectedTask: Task | null
  onDelete: (taskId: string) => void
  onUpdate: (updatedTask: Task) => void
}

export default function TaskUpdateForm({
  showUpdateForm,
  onRequestClose,
  selectedTask,
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
      const newSelectedDate = new Date(value)
      newSelectedDate.setHours(0, 0, 0, 0)
      setUpdatedTaskDetails((prev) => ({
        ...prev,
        date: newSelectedDate,
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
        ...selectedTask,
        name: updatedTaskDetails.name,
        date: newUpdatedDate,
        startHour: updatedTaskDetails.startHour,
        endHour: updatedTaskDetails.endHour,
      }

      onUpdate(updatedTask)
      selectedTask && onUpdate(updatedTaskDetails)
    }
    onRequestClose()
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
            x
          </button>

          <form onSubmit={handleUpdate} className="form-update">
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
            <button
              type="submit"
              className="submit-button"
              // onClick={handleUpdate}
            >
              update
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                onRequestClose()
                console.log('cancel')
              }}
            >
              cancel
            </button>
            <button type="button" onClick={handleDelete}>
              delete
            </button>
          </form>
        </div>
      </div>
    </>
  ) : null
}
