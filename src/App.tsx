import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  getNextWeek,
  getPreviousWeek,
  today,
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
  date: Date;
  startHour: string;
  endHour: string;
}

export default function App() {
  const { currentDateState, setCurrentDateState } = useCurrentDateState();
  const [tasks, setTasks] = useState<Task[]>([]);

  const storage = {
    set: (key: string, value: any) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    get: (key: string, defaultValue?: Task[]): Task[] => {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    },
    remove: (key: string) => {
      localStorage.removeItem(key);
    },
  };

  useEffect(() => {
    const localStorageTasks = storage.get("tasks", []);
    setTasks(localStorageTasks);
  }, []);

  const handleAddTask = (newTask: Task, selectedDate: Date) => {
    const timeString = newTask.startHour;

    const [hours, minutes] = timeString.split(":");

    const parsedHours = parseInt(hours);
    const parsedMinutes = parseInt(minutes);

    const newSelectedDate = new Date(selectedDate); // Clone the selected date
    newSelectedDate.setHours(parsedHours, parsedMinutes, 0, 0); // Set the selected time

    const utcDate = new Date(
      newSelectedDate.getTime() - newSelectedDate.getTimezoneOffset() * 60000
    );

    const updatedTask = {
      ...newTask,
      date: utcDate, // Store as UTC ISO string
    };

    setTasks((prevTasks) => [...prevTasks, updatedTask]);
    setCurrentDateState(new Date(selectedDate));

    // Store tasks with UTC date in local storage
    storage.set("tasks", [...tasks, updatedTask]);
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

  const isToday = (dateToCheck: Date) => {
    return (
      dateToCheck.getFullYear() === today.getFullYear() &&
      dateToCheck.getMonth() === today.getMonth() &&
      dateToCheck.getDay() === today.getDay() &&
      dateToCheck.getDate() === today.getDate()
    );
  };

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
        <AddTaskForm
          handleAddTask={handleAddTask}
          currentDateState={currentDateState}
          // setCurentDateState={setCurrentDateState}
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
                isToday={isToday}
                storage={storage}
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
                storage={storage}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
