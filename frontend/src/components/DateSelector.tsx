import { Task, TaskRequest } from "../types"

interface Props {
    startDate: Date
    handlePrev: () => void
    handleNext: () => void
    dates: Date[]
    selectedDate: Date
    setSelectedDate: (date: Date) => void
    setTaskRequest: (request: (prevRequest: TaskRequest) => TaskRequest) => void
    setTasks: (tasks: Task[]) => void
}

const DateSelector = ({ startDate, handlePrev, handleNext, dates, selectedDate, setSelectedDate, setTaskRequest, setTasks }: Props) => (
    <div className="flex flex-col items-center justify-center gap-2 mt-4">
        <p>{startDate.toLocaleString('default', { month: 'long' })}</p>
        <div className="flex items-center justify-center w-full">
            <button
                onClick={handlePrev}
                className="text-xl w-[40px] h-[40px] bg-gray-200 rounded-full hover:bg-gray-300 text-center"
            >
                ←
            </button>
            <div className="flex gap-1 p-2">
                {dates.map((date, index) => {
                    const isToday = date.toDateString() === new Date().toDateString()
                    const isClicked = date.toDateString() === selectedDate?.toDateString()
                    return (
                        <button
                            key={index}
                            onClick={async () => {
                                setSelectedDate(date)
                                setTaskRequest((prev) => ({ ...prev, date }))
                                setTasks([])
                            }}
                            className={`text-center w-[50px] h-[70px] rounded-full ${isToday || (isToday && isClicked) ? "bg-blue-500 text-white" : ""} ${isClicked && !isToday ? 'border-blue-500 bg-white text-blue-500 border-[1px]' : ''} `}
                        >
                            <div className="font-bold">{date.getDate()}</div>
                            <div className="text-xs">{date.toLocaleString('default', { weekday: 'short' })}</div>
                        </button>
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
)


export default DateSelector