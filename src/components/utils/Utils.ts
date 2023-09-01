import { useState } from 'react';

export const dayNames: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export const weekDayNames: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const today: Date = new Date()

export const todayNumber: number = today.getDay()

export const getDayName = (date: Date): string => {
  const currentDate: Date = new Date(date)
  const currentDayIndex: number = currentDate.getDay()
  const dayName = dayNames[currentDayIndex]
  return dayName;
}

// get day of the month
export const getMonthDayNumber = (d: Date): number => {
  const currentDate: Date = new Date(d)
  const monthDay: number = currentDate.getDate()
  return monthDay
}

export const useCurrentDateState = () => {
  const initialDate = new Date(today);
  initialDate.setHours(0, 0, 0, 0);
  const [currentDateState, setCurrentDateState] = useState(initialDate);
  return { currentDateState, setCurrentDateState };
};

export const getFirstDateOfWeek = (d: Date = new Date()) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const newDate = new Date(date.setDate(diff));
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export const getLastDateOfWeek = (d: Date) => {
  const lastDateOfWeek = new Date(d);
  const lastDayOfWeek = d.getDay() === 0 ? 6 : d.getDay() - 1;
  lastDateOfWeek.setDate(d.getDate() + (6 - lastDayOfWeek));
  lastDateOfWeek.setHours(23,59,59,999)
  return lastDateOfWeek;
};

export const getNextWeek = (date: Date = new Date()) => {
  const dateCopy = new Date(date.getTime());
  const nextMonday = new Date(
    dateCopy.setDate(
      dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7),
    ),
  );
  return nextMonday;
}

export const getPreviousWeek = (date: Date = new Date()) => {
  const dateCopy = new Date(date.getTime());
  const peviousMonday = new Date(
    dateCopy.setDate(
      dateCopy.getDate() - ((7 - dateCopy.getDay() + 1) % 7 || 7),
    ),
  );
  return peviousMonday;
}

export const hours = Array.from({ length: 24 }, (v, i) => i);
