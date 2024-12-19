import { createContext, useContext, useState, useEffect } from 'react'
import axios from '../utils/axios'

// init context
const AuthContext = createContext()

// export the consumer
export function useAuth() {
  return useContext(AuthContext)
}

// export the provider (handle all the logic here)
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [account, setAccount] = useState(null)
  const [checkedToken, setCheckedToken] = useState(false)

  const register = (formData = {}) =>
    new Promise((resolve, reject) => {
      axios
        .post('/auth/register', formData)
        .then(({
          data: {
            data: accountData
          },
        }) => {
          setAccount(accountData)
          setCheckedToken(true)
          setIsLoggedIn(true)
          resolve(true)
        })
        .catch((error) => {
          console.error(error)
          reject(error?.response?.data?.message || error.message)
        })
    })

  const login = (formData = {}) =>
    new Promise((resolve, reject) => {
      axios
        .post('/auth/login', formData)
        .then(({
          data: {
            data: accountData
          },
        }) => {
          setAccount(accountData)
          setCheckedToken(true)
          setIsLoggedIn(true)
          resolve(true)
        })
        .catch((error) => {
          console.error(error)
          reject(error?.response?.data?.message || error.message)
        })
    })

  const logout = async () => {
    await axios.get('/auth/logout');
    setIsLoggedIn(false)
    setAccount(null)
    setCheckedToken(true)
  }

  const loginWithToken = async () => {
    try {
      const {
        data: {
          data: accountData
        },
      } = await axios.get('/auth/login')

      setAccount(accountData)
      setCheckedToken(true)
      setIsLoggedIn(true)
    } catch (error) {
      console.error(error)
      if (error?.response?.statusCode === 401) setCheckedToken(true)
    }
  }

  // This side effect keeps local storage updated with recent token value,
  // making sure it can be re-used upon refresh or re-open browser
  /** 
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])
  */

  // This side effect runs only if we have a token, but no account or logged-in boolean.
  // This "if" statement is "true" only when refreshed, or re-opened the browser,
  // if true, it will then ask the backend for the account information (and will get them if the token hasn't expired)
  useEffect(() => {
    if (!isLoggedIn && !account && !checkedToken) loginWithToken()
  }, [isLoggedIn, account, checkedToken]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        account,
        register,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  )
}
