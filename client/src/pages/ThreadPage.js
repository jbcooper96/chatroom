import MessageThread from "../components/MessageThread"
import {useAuth} from '../contexts/AuthContext'

export default function ThreadPage() {
    const { isLoggedIn } = useAuth()

    return (
        isLoggedIn && <MessageThread />
    )
}