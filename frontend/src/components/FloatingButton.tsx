import { FiPlus } from "react-icons/fi"
import { Task } from "../types"

interface Props {
    setError: (error: string | null) => void
    selectedTask: Task | null
    setSelectedTask: (task: Task | null) => void
    setIsOpen: (isOpen: (prevValue: boolean) => boolean) => void
    isOpen: boolean
}

const FloatingButton = ({ setError, selectedTask, setSelectedTask, setIsOpen, isOpen }: Props) => (
    <button
        type="button"
        onClick={() => {
            setError(null)
            if (selectedTask) {
                setSelectedTask(null)
            } else {
                setIsOpen((prev) => !prev)
            }
        }}
        className={`fixed flex justify-center items-center shadow-xl bottom-6 right-6 md:right-1/2 md:translate-x-[280px] rounded-full
                            ${(isOpen || selectedTask)
                ? "bg-red-500 transition duration-300 ease-in-out transform rotate-45"
                : "bg-blue-500 transition duration-300 ease-in-out transform rotate-0"
            } text-white z-30 w-[70px] h-[70px]`}
    >
        <FiPlus size={35} />
    </button>
)

export default FloatingButton