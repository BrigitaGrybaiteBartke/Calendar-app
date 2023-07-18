import { NavLink } from 'react-router-dom';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { months, getLastDateOfWeek, today } from './utils/Utils'
import { useState } from 'react';
import './assets/Navbar.css'

interface NavigationProps {
    currentDateState: Date;
    handleBackwardButton: () => void;
    handleForwardButton: () => void;
    viewType: string;
    handleViewTypeChange: (viewType: string) => void
}

export default function Navigation ({ currentDateState, handleBackwardButton, handleForwardButton, viewType, handleViewTypeChange }: NavigationProps) {

    const [isActiveLink, setIsActiveLink] = useState(false)
    
    const monthDay: number = currentDateState.getDate()
    const currentYear = currentDateState.getFullYear()
    const currentMonth = months[currentDateState.getMonth()]
    const lastDateOfWeek = getLastDateOfWeek(currentDateState)
    const weekSecondMonth = months[lastDateOfWeek.getMonth()];
    const weekSecondYear = lastDateOfWeek.getFullYear()

    const renderDateForNav = (viewType: string) => {
        if (viewType === 'day') {
            return (
                <span>{`${currentMonth} ${monthDay}, ${currentYear}`}</span>
            )
        } else if (viewType === 'week') {
            return (
                <span>
                    {currentYear === weekSecondYear
                        ? (currentMonth === weekSecondMonth
                            ? `${currentMonth}, ${currentYear}`
                            : `${currentMonth} - ${weekSecondMonth}, ${currentYear}`
                        )
                        : `${currentMonth}, ${currentYear} - ${weekSecondMonth}, ${weekSecondYear}`
                    }
                </span>
            )
        } else if (viewType === 'month') {
            return (
                <span>{`${currentMonth}, ${currentYear}`}</span>
            )
        }
        return null
    }

    return (
        <>
            <nav className='navbar'>
                <div className='navbar-date-button'>
                    <button
                        className='button-backward'
                        onClick={handleBackwardButton}
                    >
                        <MdOutlineArrowBackIosNew />
                    </button>
                    <button
                        className='button-forward'
                        onClick={handleForwardButton}
                    >
                        <MdOutlineArrowForwardIos />
                    </button>
                    <div className='navbar-date'>
                        {renderDateForNav(viewType)}
                    </div>
                </div>
                <ul className='navbar-links'>
                    <div className='menu'>
                        <li>
                            <NavLink
                                to="./day"
                                className="menu-link active"
                                onClick={() => handleViewTypeChange('day')}
                            >
                                Day
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="./week"
                                className="menu-link"
                                onClick={() => handleViewTypeChange('week')}
                            >
                                Week
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="./month"
                                className="menu-link"
                                onClick={() => handleViewTypeChange('month')}
                            >
                                Month
                            </NavLink>
                        </li>
                    </div>
                </ul>
            </nav>
        </>
    );
};