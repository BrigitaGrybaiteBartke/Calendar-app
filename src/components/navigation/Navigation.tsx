import { NavLink } from 'react-router-dom'
import { months, getLastDateOfWeek, today } from '../../utils/Utils'
import { NavigationProps } from '../../utils/Types'
import './Navigation.css'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { MdOutlineArrowForwardIos } from 'react-icons/md'

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
      <nav className="navbar">
        <div className="navbar-header">
          <div className="header-calc">calendar</div>
          <div className="header-today">{today.getDate()}</div>
        </div>
        <div className="navbar-today">
          <button className="today-btn" onClick={handleTodayClick}>
            Today
          </button>
        </div>
        <div className="navbar-date-bar">
          <button className="backward-btn" onClick={handleBackwardButton}>
            <MdOutlineArrowBackIosNew />
          </button>
          <button className="forward-btn" onClick={handleForwardButton}>
            <MdOutlineArrowForwardIos />
          </button>
          <div className="navbar-date">{renderDateForNav(viewType)}</div>
        </div>
        <ul className="navbar-menu">
          <div className="links">
            <li>
              <NavLink
                to="./day"
                className={`link ${viewType === 'day' && 'active'}`}
                onClick={() => handleViewTypeChange('day')}
              >
                Day
              </NavLink>
            </li>
            <li>
              <NavLink
                to="./week"
                className={`link ${viewType === 'week' && 'active'}`}
                onClick={() => handleViewTypeChange('week')}
              >
                Week
              </NavLink>
            </li>
            <li>
              <NavLink
                to="./month"
                className={`link ${viewType === 'month' && 'active'}`}
                onClick={() => handleViewTypeChange('month')}
              >
                Month
              </NavLink>
            </li>
          </div>
        </ul>
      </nav>
    </>
  )
}
