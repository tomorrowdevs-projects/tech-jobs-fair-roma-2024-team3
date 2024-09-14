import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const Home = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token || !user) {
            navigate("/")
        }
    }, [navigate, user])

    return (
        <div>
            <p>Ciao, {user?.username}</p>
        </div>
    )
}

export default Home