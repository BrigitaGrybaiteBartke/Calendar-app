import React from 'react'
import { NavLink } from 'react-router-dom'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { MdOutlineArrowForwardIos } from 'react-icons/md'
import { months, getLastDateOfWeek, today } from '../../utils/Utils'
import './Navigation.css'

interface NavigationProps {
  currentDateState: Date
  setCurrentDateState: React.Dispatch<React.SetStateAction<Date>>
  handleBackwardButton: () => void
  handleForwardButton: () => void
  viewType: string
  handleViewTypeChange: (viewType: string) => void
}

export default function Navigation({
  currentDateState,
  setCurrentDateState,
  handleBackwardButton,
  handleForwardButton,
  viewType,
  handleViewTypeChange,
}: NavigationProps) {
  const monthDay: number = currentDateState.getDate()
  const currentYear = currentDateState.getFullYear()
  const currentMonth = months[currentDateState.getMonth()]
  const lastDateOfWeek = getLastDateOfWeek(currentDateState)
  const weekSecondMonth = months[lastDateOfWeek.getMonth()]
  const weekSecondYear = lastDateOfWeek.getFullYear()

  const renderDateForNav = (viewType: string) => {
    if (viewType === 'day') {
      return <span>{`${currentYear}, ${currentMonth} ${monthDay}`}</span>
    } else if (viewType === 'week') {
      return (
        <span>
          {currentYear === weekSecondYear
            ? currentMonth === weekSecondMonth
              ? `${currentYear}, ${currentMonth}`
              : `${currentYear}, ${currentMonth} - ${weekSecondMonth}`
            : `${currentMonth}, ${currentYear} - ${weekSecondMonth}, ${weekSecondYear}`}
        </span>
      )
    } else if (viewType === 'month') {
      return <span>{`${currentMonth}, ${currentYear}`}</span>
    }
    return null
  }

  const handleTodayClick = () => {
    setCurrentDateState(today)
  }

  return (
    <>
      <div className="top-grid">
        <nav className="navbar">
          <div className="navbar-today">
            <button className="button-today" onClick={handleTodayClick}>
              Today
            </button>
          </div>
          <div className="navbar-date-bar">
            <button className="button-backward" onClick={handleBackwardButton}>
              <MdOutlineArrowBackIosNew />
            </button>
            <button className="button-forward" onClick={handleForwardButton}>
              <MdOutlineArrowForwardIos />
            </button>
            <div className="navbar-date">{renderDateForNav(viewType)}</div>
          </div>
          <ul className="navbar-links">
            <div className="menu">
              <li>
                <NavLink
                  to="./day"
                  className={`menu-link ${viewType === 'day' && 'active'}`}
                  onClick={() => handleViewTypeChange('day')}
                >
                  Day
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="./week"
                  className={`menu-link ${viewType === 'week' && 'active'}`}
                  onClick={() => handleViewTypeChange('week')}
                >
                  Week
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="./month"
                  className={`menu-link ${viewType === 'month' && 'active'}`}
                  onClick={() => handleViewTypeChange('month')}
                >
                  Month
                </NavLink>
              </li>
            </div>
          </ul>
        </nav>
      </div>
    </>
  )
}
