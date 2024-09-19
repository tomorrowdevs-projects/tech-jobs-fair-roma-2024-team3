import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FiPlus } from "react-icons/fi";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import { Task, TaskRequest } from "../types";
import useTask, { TaskSchema } from "../hooks/useTask";
import "react-datepicker/dist/react-datepicker.css";
import { deleteById } from "../api/task"
import { ZodError } from "zod"
import { AxiosError } from "axios"
import TaskCard from "../components/TaskCard"
import TaskModal from "../components/TaskModal"
import Charts from "../components/Charts"
import ApiCaller from "../api/apiCaller"

const publicVapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;
const baseUrl = import.meta.env.VITE_BASE_URL;

const HomePage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user, login, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(startDate);
  const [taskRequest, setTaskRequest] = useState<TaskRequest>({
    name: "",
    userId: 0,
    date: selectedDate ?? new Date().setHours(new Date().getHours() + 1),
    done: false,
    repeat: "None",
  });
  const {
    createTask,
    updateTask,
    findTasksByUserAndDate,
    loading: taskLoading,
  } = useTask();
  const [isChartOpen, setIsChartOpen] = useState<boolean>(false)

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
    newStartDate.setDate(startDate.getDate() - 5);
    setStartDate(newStartDate);
  };

  const handleNext = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + 5);
    setStartDate(newStartDate);
  };

  const getTasks = async () => {
    if (user?.id) {
      const tasks = await findTasksByUserAndDate(user.id, selectedDate)
      setTasks(tasks ?? [])
    }
  }

  const dates = generateDates(startDate);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getUser = async () => {
      if (token && !user) {
        try {
          const newToken = await login(undefined, token);
          localStorage.setItem("token", newToken)
          getTasks()
        } catch (err) {
          console.log(err)
          localStorage.removeItem("token")
          navigate("/")
        }
      }
      if (!token || !user) {
        navigate("/");
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    getTasks()
  }, [selectedDate])

  const handleInput = (field: string, value: string) => {
    value = value.trim();
    setError(null)
    setTaskRequest(prevDetails => ({
      ...prevDetails,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      TaskSchema.parse(taskRequest)
      if (!selectedTask) {
        const task = await createTask({ ...taskRequest, userId: user?.id as number })
        setTasks((prevTasks) => [...(prevTasks?.length ? prevTasks : []), task]);
        setIsOpen(false)
        setTaskRequest({
          name: "",
          userId: 0,
          date: selectedDate ?? new Date(),
          done: false,
          repeat: "None",
        })
      } else {
        const updatedTask = await updateTask({ ...taskRequest, id: selectedTask?.id as number, userId: user?.id as number })
        setSelectedTask(null)
        setTasks((prevTasks) =>
          prevTasks?.map(task =>
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task
          )
        );
      }
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0].message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else if (err instanceof AxiosError) {
        setError("Ops, something went wrong!")
      } else {
        setError(err as string)
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    const registerServiceWorker = async () => {
      try {
        const register = await navigator.serviceWorker.register('/worker.js', {
          scope: '/'
        });

        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicVapidKey,
        });

        await ApiCaller().post(baseUrl + "/subscribe", subscription, {
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (err) {
        console.log(err);
      }
    };

    if ('serviceWorker' in navigator && token && user) {
      registerServiceWorker();
    }
  }, []);

  const sortedTasks = useMemo(() => {
    return tasks?.slice().sort((a, b) => {
      const dateA = new Date(a.date).getTime(); // Convert to timestamp if needed
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    }) || [];
  }, [tasks])

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <Spinner isInverted />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="flex items-center justify-center flex-1">
        <div className="relative min-h-screen md:w-[600px] flex flex-col w-full border-x-[1px] border-gray-200">
          <Header
            logout={logout}
            navigate={() => navigate("/")}
            username={user?.name}
          />
          {!isChartOpen &&
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
          }
          <div onClick={() => setIsChartOpen((prev) => !prev)} className="flex justify-start items-center p-4 pb-0">
            <p className="italic underline text-blue-500 cursor-pointer">{!isChartOpen ? 'Show' : 'Hide'} charts</p>
          </div>
          {isChartOpen ?
            <Charts /> :
            <div className="px-4 mt-8">
              {sortedTasks?.length ?
                sortedTasks?.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    setSelectedTask={setSelectedTask}
                    updateTask={updateTask}
                    setTasks={setTasks}
                    deleteById={deleteById}
                  />
                )) : taskLoading ?
                  <div className="w-full flex justify-center items-center">
                    <Spinner isInverted />
                  </div> :
                  <p className="w-full text-center">No tasks for this day</p>
              }
            </div>
          }
          {!isChartOpen &&
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
          }
        </div>
      </div>
      {(isOpen || selectedTask) && (
        <TaskModal
          selectedTask={selectedTask as Task}
          setTaskRequest={setTaskRequest}
          taskRequest={taskRequest}
          error={error as string}
          setError={setError}
          taskLoading={taskLoading}
          handleInput={handleInput}
          handleSubmit={handleSubmit}
        />
      )}
    </Fragment>
  );
};

export default HomePage;
