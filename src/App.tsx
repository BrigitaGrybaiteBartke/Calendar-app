import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  getNextWeek,
  getPreviousWeek,
  useCurrentDateState,
} from "./components/utils/Utils";
import Navigation from "./components/Navigation";
import "./App.css";
import SingleDayPage from "./components/SingleDayPage";
import AddTaskForm from "./components/AddTaskForm";
import WeekDayPage from "./components/WeekDayPage";

interface Task {
  id: string;
  name: string;
  date: string;
  startHour: string;
  endHour: string;
}

export default function App() {
  const { currentDateState, setCurrentDateState } = useCurrentDateState();

  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = (newTask: Task, selectedDate: string ) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setCurrentDateState(new Date(selectedDate))   
  };

  const getviewType = () => {
    const currentPath = window.location.pathname;
    if (currentPath === "/day") {
      return "day";
    } else if (currentPath === "/week") {
      return "week";
    } else if (currentPath === "/month") {
      return "month";
    }
    return "day";
  };

  const [viewType, setViewType] = useState(getviewType());

  const handleViewTypeChange = (viewType: string) => {
    if (viewType) {
      setViewType(viewType);
    }
  };

  const handleBackwardButton = () => {
    if (viewType === "day") {
      const previousDate = new Date(currentDateState);
      previousDate.setDate(previousDate.getDate() - 1);
      setCurrentDateState(previousDate);
    } else if (viewType === "week") {
      const nextWeek = getPreviousWeek(currentDateState);
      setCurrentDateState(nextWeek);
    }
  };

  const handleForwardButton = () => {
    if (viewType === "day") {
      const nextDate = new Date(currentDateState);
      nextDate.setDate(nextDate.getDate() + 1);
      setCurrentDateState(nextDate);
    } else if (viewType === "week") {
      const nextWeek = getNextWeek(currentDateState);
      setCurrentDateState(nextWeek);
    }
  };

  return (
    <>
      <BrowserRouter>
        <Navigation
          currentDateState={currentDateState}
          handleBackwardButton={handleBackwardButton}
          handleForwardButton={handleForwardButton}
          viewType={viewType}
          handleViewTypeChange={handleViewTypeChange}
        />
        <AddTaskForm 
        handleAddTask={handleAddTask} 
        currentDateState={currentDateState}
        setCurentDateState={setCurrentDateState}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/day" />} />
          <Route
            path="/day"
            element={
              <SingleDayPage
                currentDateState={currentDateState}
                tasks={tasks}
                setTasks={setTasks}
              />
            }
          />
          <Route
            path="/week"
            element={<WeekDayPage currentDateState={currentDateState} tasks={tasks} setTasks={setTasks} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
