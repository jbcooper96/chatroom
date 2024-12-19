import {useAuth} from '../contexts/AuthContext'
import Header from '../components/Header'
import ParentMessages from '../components/ParentMessages'

export default function App() {
  const {isLoggedIn} = useAuth()

  return (
      isLoggedIn && <ParentMessages />
  )
}
