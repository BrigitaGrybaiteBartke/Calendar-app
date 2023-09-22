import { createContext, useContext, useState } from 'react'

const LoadingContext = createContext()

export const LoadingProvider = ({ children }) => {
  const [isloading, setIsLoading] = useState(true)

  return (
    <LoadingContext.Provider value={{ isloading, setIsLoading }}>
      {children}
      {isloading && <div>Loading...</div>}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
