import DatePicker from "react-datepicker"
import Input from "./Input"
import { CiCalendar } from "react-icons/ci"
import Spinner from "./Spinner"
import { Task, TaskRequest } from "../types"

interface Props {
    selectedTask: Task
    setTaskRequest: (request: (prevRequest: TaskRequest) => TaskRequest) => void
    taskRequest: TaskRequest
    error: string
    setError: (err: string | null) => void
    taskLoading: boolean
    handleInput: (field: string, value: string) => void
    handleSubmit: () => void
}

const TaskModal = ({ selectedTask, setTaskRequest, taskRequest, error, setError, taskLoading, handleInput, handleSubmit }: Props) => (
    <>
        <div className="absolute top-0 left-0 z-10 w-full h-screen bg-black opacity-30" />
        <div className="absolute top-0 left-0 z-20 flex items-center justify-center w-full h-screen">
            <div className="p-4 bg-white rounded-lg shadow-lg w-96">
                <h2 className="mb-6 text-2xl font-bold text-center">
                    {selectedTask ? `Update ${selectedTask.name}` : 'Add new task'}
                </h2>

                <div className="mb-4">
                    <Input id="name" name="name" label="Name" placeholder="Enter task name" onChange={handleInput} />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
                        Pick a date
                    </label>
                    <div className="py-[6px] px-2 border-[1px] border-gray-200 shadow-md rounded-md relative">
                        <DatePicker
                            selected={taskRequest.date}
                            dateFormat={"dd/MM/yyyy"}
                            onChange={(date) => {
                                setError(null)
                                setTaskRequest((prevRequest) => ({
                                    ...prevRequest,
                                    date: date as Date
                                }))
                            }}
                        />
                        <span className="absolute top-[8px] right-2">
                            <CiCalendar size={20} />
                        </span>
                    </div>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <button
                    disabled={taskLoading}
                    className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-blue-500 rounded md:hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                    onClick={handleSubmit}
                >
                    {taskLoading ? <Spinner /> : null}
                    {!taskLoading ? selectedTask ? 'Update' : 'Create' : null}
                </button>
            </div>
        </div>
    </>
)

export default TaskModal