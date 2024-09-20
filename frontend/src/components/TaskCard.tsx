import { GoTrash } from "react-icons/go"
import { Task } from "../types"

interface Props {
    task: Task
    setSelectedTask: (t: Task) => void
    updateTask: (task: Task) => void
    setTasks: (tasks: (prevTasks: Task[]) => Task[]) => void
    deleteTask: (taskId: number) => void
    findTasks: () => void
}

const TaskCard = ({ task, setSelectedTask, updateTask, setTasks, deleteTask, findTasks }: Props) => (
    <div onClick={() => setSelectedTask(task)} className={`${task.done ? "line-through bg-blue-500 text-white" : "bg-white border-blue-500 text-blue-500"} font-medium p-4 w-full border-[1px] rounded-md shadow-lg mt-4 cursor-pointer flex justify-between items-center`}>
        <div className="flex justify-center items-center gap-4">
            <div
                className={`${task.done ? "bg-green-300" : "bg-white"} w-4 h-4 border-[1px] border-blue-500 rounded-md`}
                onClick={(e) => {
                    e.stopPropagation()
                    const completedTask = { ...task, done: !task.done }
                    updateTask(completedTask)
                    findTasks()
                    setTasks((prevTasks: Task[]) =>
                        prevTasks?.map(prevTasks =>
                            prevTasks.id === completedTask.id ? { ...task, ...completedTask } : prevTasks
                        )
                    );
                }}
            />
            <p>{task.name}</p>
            <p>{`${new Date(task?.date)?.getHours()}:${new Date(task?.date)?.getMinutes()}`}</p>
        </div>
        <button onClick={async (e) => {
            e.stopPropagation()
            deleteTask(task.id)
            findTasks()
            setTasks((prevTasks: Task[]) =>
                prevTasks?.filter(prevTask =>
                    prevTask.id !== task.id
                )
            );
        }}>
            <GoTrash size={20} />
        </button>
    </div>
)

export default TaskCard