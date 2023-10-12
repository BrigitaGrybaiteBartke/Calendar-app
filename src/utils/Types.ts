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
  onViewTypeChange: (viewType: string) => void
}

export interface AddTaskFormProps {
  currentDateState: Date
  showAddForm: boolean
  onAdd?: (newTask: Task, selectedDate: Date) => void
  onClose: (componentIdentifier: string) => void
}

export interface UpdateTaskFormProps {
  showUpdateForm: boolean
  selectedTask: Task | null
  onDelete: (taskId: string) => void
  onUpdate: (updatedTask: Task, updatedDate: Date) => void
  onClose: (componentIdentifier: string) => void
}

export interface DayPageHeaderProps {
  dayName: string
  monthDay: number
  currentDateState: Date
}

export interface DayPageProps {
  currentDateState: Date
  currentDayTasks: Task[]
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>
  setShowUpdateForm: React.Dispatch<React.SetStateAction<boolean>>
  onUpdate: (updatedTask: Task, updatedDate: Date) => void
}

export interface WeekPageProps {
  currentDateState: Date
  currentWeekTasks: Task[]
  setShowUpdateForm: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>
  onUpdate: (updatedTask: Task, updatedDate: Date) => void
}

export interface WeekPageHeaderProps {
  weekDayNames: string[]
  firstDateOfWeek: Date
  lastDateOfWeek: Date
}

export interface TimingsProps {
  hours: number[]
}
