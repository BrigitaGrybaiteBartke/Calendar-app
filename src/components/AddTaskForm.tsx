import React, { useState } from "react";

interface Task {
  id: string;
  name: string;
  date: string;
  startHour: string;
  endHour: string;
}

interface AddTaskFormProps {
  handleAddTask?: (newTask: Task, selectedDate: string) => void;
  currentDateState: Date;
  setCurentDateState: React.Dispatch<React.SetStateAction<Date>>;
}

const AddTaskForm = ({
  handleAddTask,
  currentDateState,
  setCurentDateState,
}: AddTaskFormProps) => {
  const [taskDetails, setTaskDetails] = useState({
    name: "",
    date: "",
    startHour: "",
    endHour: "",
  });

  const handleInputChange = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    setTaskDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    if (handleAddTask) {
      const selectedDate = taskDetails.date
        ? taskDetails.date
        : currentDateState.toISOString().substring(0, 10);

      const newTask = {
        id: Date.now().toString(),
        name: taskDetails.name,
        date: selectedDate,
        startHour: taskDetails.startHour,
        endHour: taskDetails.endHour,
      };

      handleAddTask(newTask, selectedDate);

      setCurentDateState(new Date(selectedDate));
      // console.log(selectedDate)
    }

    setTaskDetails({
      name: "",
      date: "",
      startHour: "",
      endHour: "",
    });

    // Update currentDateState to match the selectedDate
  };

  return (
    <>
      <div className="side-grid">
        <div className="form">
          <form onSubmit={handleFormSubmit}>
            <div className="input-box">
              {/* <label>Enter Task</label> */}
              <input
                type="text"
                name="name"
                placeholder="Enter task..."
                onChange={handleInputChange}
                value={taskDetails.name}
                //   required
              />
            </div>
            <div className="input-box">
              <label>Start Date:</label>
              <input
                type="date"
                name="date"
                onChange={handleInputChange}
                value={taskDetails.date}
                //   required
              />
            </div>
            <div className="input-box">
              <label>Start Hour:</label>
              <input
                type="time"
                name="startHour"
                onChange={(e) => {
                  handleInputChange(e);
                }}
                value={taskDetails.startHour}
                // required
              />
            </div>
            <div className="input-box">
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
      </div>
    </>
  );
};

export default AddTaskForm;
