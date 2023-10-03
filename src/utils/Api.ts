import { Task } from './Types'

export const url = 'http://localhost:8000/tasks'

export const fetchDataRequest = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
    })

    if (!response.ok) {
      return new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    const tasksWithLocalTime = data.map((task: Task) => {
      const utcTimeStamp = task.date
      const date = new Date(utcTimeStamp)
      return {
        ...task,
        date: date,
      }
    })

    return tasksWithLocalTime
  } catch (error) {
    console.error('Error:', error)
    return error
  }
}

export const deleteDataRequest = async (url: string, taskId: string) => {
  try {
    const response = await fetch(`${url}/${taskId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return new Error('Failed to delete data')
    }

    return response.json()
  } catch (error) {
    console.error(error)
    return error
  }
}

export const postDataRequest = async (url: string, newData: Task) => {
  try {
    const utcDate = newData.date.toISOString()

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...newData,
        date: utcDate,
      }),
    })

    if (!response.ok) {
      return new Error('Failed to add data')
    }

    return response.json()
  } catch (error) {
    console.error(error)
    return error
  }
}

export const putDataRequest = async (url: string, updatedData: Task) => {
  try {
    const utcDate = updatedData.date.toISOString()

    const requestBody = {
      ...updatedData,
      date: utcDate,
    }

    const response = await fetch(`${url}/${updatedData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      return new Error('Failed to update data on the server')
    }

    return await response.json()
  } catch (error) {
    console.error(error)
    return error
  }
}
