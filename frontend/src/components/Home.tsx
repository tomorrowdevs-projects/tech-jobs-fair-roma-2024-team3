import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { FiPlus } from "react-icons/fi"

const tasks = [
    {
        id: 1,
        name: "Bere acqua",
        isDone: false
    },
    {
        id: 2,
        name: "Camminare",
        isDone: false
    },
    {
        id: 3,
        name: "Studiare",
        isDone: true
    },
    {
        id: 4,
        name: "Coding",
        isDone: false
    }
]

const Home = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [currentTasks, setCurrentTasks] = useState(tasks)
    const { user } = useAuth()
    const navigate = useNavigate()
    const [startDate, setStartDate] = useState(new Date());

    // Generate an array of 10 dates starting from startDate
    const generateDates = (start: Date) => {
        const dates = [];
        for (let i = 0; i < 5; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const handlePrev = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(startDate.getDate() - 5); // Go back by 10 days
        setStartDate(newStartDate);
    };

    const handleNext = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(startDate.getDate() + 5); // Go forward by 10 days
        setStartDate(newStartDate);
    };

    const dates = generateDates(startDate);

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token || !user) {
            navigate("/")
        }
    }, [navigate, user])

    return (
        <div className="p-6 min-h-screen flex flex-col w-full">
            <p className="text-[50px] font-semibold">Ciao, {user?.username} &#128075;</p>
            <div className="flex justify-center items-center flex-col gap-2 mt-4">
                <p>{startDate.toLocaleString('default', { month: 'long' })}</p>
                <div className="flex items-center justify-center w-full space-x-2">
                    <button
                        onClick={handlePrev}
                        className="text-xl w-[40px] h-[40px] bg-gray-200 rounded-full hover:bg-gray-300 text-center"
                    >
                        ←
                    </button>
                    <div className="flex">
                        {dates.map((date, index) => {
                            const isToday = date.toDateString() === new Date().toDateString()
                            return (
                                <div key={index} className={`text-center p-4 rounded-full ${isToday ? "bg-blue-500 text-white" : "text-gray-700"} `}>
                                    <div className="font-bold ">{date.getDate()}</div>
                                    <div className="text-xs">{date.toLocaleString('default', { weekday: 'short' })}</div>
                                </div>
                            )
                        })}
                    </div>
                    <button
                        onClick={handleNext}
                        className="text-xl w-[40px] h-[40px] bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                        →
                    </button>
                </div>
            </div>
            <div className="mt-8">
                {currentTasks.map((t) => {
                    return (
                        <div key={t.id} className={`${t.isDone ? "line-through bg-blue-500 text-white" : "bg-white border-blue-500 text-blue-500"} font-medium p-4 w-full border-[1px] rounded-md shadow-lg mt-4`}>
                            <p>{t.name}</p>
                        </div>
                    )
                })}
            </div>

            <button
                type="button"
                onClick={() => {
                    // setIsOpen((prev) => !prev)
                    setCurrentTasks((prev) => ([...prev, {
                        id: 5,
                        name: "Test",
                        isDone: false
                    }]))
                }}
                className={`lg:hidden fixed flex justify-center items-center shadow-xl bottom-6 right-6 rounded-full
                ${isOpen
                        ? "bg-red-500 transition duration-300 ease-in-out transform rotate-45"
                        : "bg-blue-500 transition duration-300 ease-in-out transform rotate-0"
                    } 
                text-white border z-20 w-[70px] h-[70px]`}
            >
                <FiPlus size={35} />
            </button>
        </div>
    )
}

export default Home