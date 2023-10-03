export interface Task {
  id: string
  name: string
  date: Date
  startHour: string
  endHour: string
}

export type TasksWithPosition = Task & {
  top: number
  left: number
}

export interface NavigationProps {
  viewType: string
  currentDateState: Date
  setCurrentDateState: React.Dispatch<React.SetStateAction<Date>>
  handleBackwardButton: () => void
  handleForwardButton: () => void
  handleViewTypeChange: (viewType: string) => void
}

export interface TaskAddFormProps {
  currentDateState: Date
  showAddForm: boolean
  onRequestClose: () => void
  onAddTask?: (newTask: Task, selectedDate: Date) => void
}

export interface TaskUpdateFormProps {
  showUpdateForm: boolean
  selectedTask: Task | null
  onRequestClose: () => void
  onDelete: (taskId: string) => void
  onUpdate: (updatedTask: Task, updatedDate: Date) => void
}

export interface DayPageHeaderProps {
  dayName: string
  monthDay: number
  currentDateState: Date
  isToday: (dateToCheck: Date) => boolean
}

export interface DayPageProps {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  currentDateState: Date
  currentDayTasks: Task[]
  setShowUpdateForm: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>
  isToday: (dateToCheck: Date) => boolean
}

export interface WeekPageProps {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  currentDateState: Date
  currentWeekTasks: Task[]
  setShowUpdateForm: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>
  isToday: (dateToCheck: Date) => boolean
}

export interface WeekPageHeaderProps {
  weekDayNames: string[]
  firstDateOfWeek: Date
  lastDateOfWeek: Date
  isToday: (dateToCheck: Date) => boolean
}

export interface TimingsProps {
  hours: number[]
}
