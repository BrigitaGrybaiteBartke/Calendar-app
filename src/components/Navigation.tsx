import { NavLink, useLocation } from 'react-router-dom';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { MdOutlineArrowForwardIos } from 'react-icons/md';


import { today, months } from './Utils'
import { useState } from 'react';

interface NavigationProps {
    currentDateState: Date;
    handleBackButton: () => void;
    handleForwardButton: () => void;
    viewType: string;
    setViewType: (viewType: string) => void;
}


const Navigation = ({ currentDateState, handleBackButton, handleForwardButton, setViewType }: NavigationProps) => {

    const location = useLocation();


    // console.log(location.pathname)
    const [isActiveClass, setIsActiveClass] = useState(false)


    const handleIsActiveClass = (e: any) => {
        console.log(e.target.value)
        // setIsActiveClass(!isActiveClass)
        // console.log(isActiveClass)

    }


    const year = currentDateState.getFullYear()
    const monthDay: number = currentDateState.getDate()
    const currentMonth = months[currentDateState.getMonth()]

    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const allMonthDays: number[] = Array.from({ length: daysInMonth }, (v, i) => i + 1)

    const handleViewTypeChange = (type: string) => {
        setViewType(type)
        console.log(type)
    }


    return (
        <>
            <nav className='navbar'>
                <div className='navbar-button'>
                    <button className='button-backward' onClick={handleBackButton}><MdOutlineArrowBackIosNew /></button>
                    <button className='button-forward' onClick={handleForwardButton}><MdOutlineArrowForwardIos /></button>
                    <div className='navbar-date'>
                        {location.pathname === '/day' && (
                            <span>{`${currentMonth} ${monthDay}th, ${year}`}</span>
                        )}
                        {location.pathname === '/week' && (
                            <span>{`${currentMonth}, ${year}`}</span>
                        )}
                        {location.pathname === '/month' && (
                            <span>{`${currentMonth}, ${year}`}</span>
                        )}

                    </div>
                </div>

                <ul className='navbar-links'>
                    <div className='menu'>
                        <li>
                            <NavLink
                                to="./day"
                                className={`menu-link ${isActiveClass ? 'active' : ''}`}
                                onChange={(e) => handleIsActiveClass(e)}
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

export default Navigation;