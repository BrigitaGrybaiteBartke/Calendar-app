import { Task } from './Types'

export const url = 'http://localhost:8000/tasks'

export const fetchDataRequest = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error(`${response.status}`)
  }

  return await response.json()
}

export const deleteDataRequest = async (url: string, taskId: string) => {
  const response = await fetch(`${url}/${taskId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete data`)
  }

  return response.json()
}

export const postDataRequest = async (url: string, newData: Task) => {
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
    throw new Error('Failed to add data')
  }

  return response.json()
}

export const putDataRequest = async (url: string, updatedData: Task) => {
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
    throw new Error('Failed to update data on the server')
  }

  return await response.json()
}
