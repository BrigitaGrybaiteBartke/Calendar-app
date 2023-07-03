import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import SingleDayView from './components/SingleDayView';
import { useCurrentDateState } from './components/Utils';
import WeekDayView from './components/WeekDayView';


function App() {

  const { currentDateState, setCurrentDateState } = useCurrentDateState();
  const [viewType, setViewType] = useState('day')

  function getNextWeek(date: Date = new Date()) {
    const dateCopy = new Date(date.getTime());
    const nextMonday = new Date(
      dateCopy.setDate(
        dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7),
      ),
    );
    return nextMonday;
  }

  function getPreviousWeek(date: Date = new Date()) {
    const dateCopy = new Date(date.getTime());
    const peviousMonday = new Date(
      dateCopy.setDate(
        dateCopy.getDate() - ((7 - dateCopy.getDay() + 1) % 7 || 7),
      ),
    );
    return peviousMonday;
  }

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


  return (
    <>
      <BrowserRouter>
        <Navigation
          currentDateState={currentDateState}
          handleBackButton={handleBackwardButton}
          handleForwardButton={handleForwardButton}
          viewType={viewType}
          setViewType={setViewType}
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

export default App;
