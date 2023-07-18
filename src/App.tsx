import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { getNextWeek, getPreviousWeek, useCurrentDateState } from './components/utils/Utils';
import Navigation from './components/Navigation';
import SingleDayView from './components/SingleDayPage';
import WeekDayView from './components/WeekDayPage';
import './App.css';

export default function App() {
  const { currentDateState, setCurrentDateState } = useCurrentDateState();

  const getviewType = () => {
    const currentPath = window.location.pathname
    if (currentPath === '/day') {
      return 'day'
    } else if (currentPath === '/week') {
      return 'week'
    } else if (currentPath === '/month') {
      return 'month'
    }
    return 'day'
  }

  const [viewType, setViewType] = useState(getviewType())

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
  };

  const handleForwardButton = () => {
    if (viewType === 'day') {
      const nextDate = new Date(currentDateState);
      nextDate.setDate(nextDate.getDate() + 1);
      setCurrentDateState(nextDate);
    } else if (viewType === 'week') {
      const nextWeek = getNextWeek(currentDateState)
      setCurrentDateState(nextWeek)
    }
  }

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
        <Routes>
          <Route path='/' element={<Navigate to='/day' />} />
          <Route path='/day' element={<SingleDayView currentDateState={currentDateState} />} />
          <Route path='/week' element={<WeekDayView currentDateState={currentDateState} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}