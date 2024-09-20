import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ZodError } from "zod"
import { AxiosError } from "axios"
import { Task, TaskRequest } from "../types";
import useTask, { TaskSchema } from "../hooks/useTask";
import ApiCaller from "../api/apiCaller"
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import TaskCard from "../components/TaskCard"
import TaskModal from "../components/TaskModal"
import Charts from "../components/Charts"
import DateSelector from "../components/DateSelector";
import FloatingButton from "../components/FloatingButton";
import "react-datepicker/dist/react-datepicker.css";

const publicVapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;
const baseUrl = import.meta.env.VITE_BASE_URL;

const HomePage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isChartOpen, setIsChartOpen] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<Date>(new Date());
  const addOneHour = () => {
    const plusOne = new Date();
    plusOne.setHours(new Date().getHours() + 1);
    return plusOne;
  }
  const [selectedDate, setSelectedDate] = useState<Date>(addOneHour);
  const [taskRequest, setTaskRequest] = useState<TaskRequest>({
    name: "",
    userId: 0,
    date: selectedDate ?? addOneHour,
    done: false,
    repeat: "None",
  });
  const { user, login, loading, logout } = useAuth();
  const navigate = useNavigate();
  const {
    createTask,
    updateTask,
    findTasksByUserAndDate,
    deleteTask,
    findTasks,
    allTasks,
    loading: taskLoading,
  } = useTask();

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

  const dates = useMemo(() => {
    return generateDates(startDate)
  }, [startDate])

  const getTasks = async () => {
    if (user?.id) {
      const tasks = await findTasksByUserAndDate(user.id, selectedDate)
      setTasks(tasks ?? [])
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getUser = async () => {
      if (token && !user) {
        try {
          const newToken = await login();
          localStorage.setItem("token", newToken)
          await getTasks()
          findTasks()
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

    const collectAndSubscribe = async () => {
      await getUser();
      if ('serviceWorker' in navigator && token && user) {
        registerServiceWorker();
      }
    }

    collectAndSubscribe()

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
        findTasks()
      } else {
        const updatedTask = await updateTask({ ...taskRequest, id: selectedTask?.id as number, userId: user?.id as number })
        setSelectedTask(null)
        setTasks((prevTasks) =>
          prevTasks?.map(task =>
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task
          )
        );
        findTasks()
      }
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0].message)
      } else if (err instanceof AxiosError || err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ops, something went wrong!")
      }
    }
  }

  const sortedTasks = useMemo(() => {
    return tasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [tasks]);

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
        <div className="relative min-h-screen md:max-w-[600px] flex flex-col w-full border-x-[1px] border-gray-200">
          <Header
            logout={logout}
            navigate={() => navigate("/")}
            username={user?.name}
          />
          {!isChartOpen &&
            <DateSelector
              startDate={startDate}
              handlePrev={handlePrev}
              handleNext={handleNext}
              dates={dates}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setTaskRequest={setTaskRequest}
              setTasks={setTasks}
            />
          }
          <div className="flex items-center justify-start p-4 pb-0">
            <p onClick={() => setIsChartOpen((prev) => !prev)} className="italic text-blue-500 underline cursor-pointer">{!isChartOpen ? 'Show' : 'Hide'} charts</p>
          </div>
          {isChartOpen ?
            <Charts allTasks={allTasks} /> :
            <div className="px-4 mt-8">
              {sortedTasks?.length ?
                sortedTasks?.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    setSelectedTask={setSelectedTask}
                    updateTask={updateTask}
                    setTasks={setTasks}
                    deleteTask={deleteTask}
                    findTasks={findTasks}
                  />
                )) : taskLoading ?
                  <div className="flex items-center justify-center w-full">
                    <Spinner isInverted />
                  </div> :
                  <p className="w-full text-center">No tasks for this day</p>
              }
            </div>
          }
          {!isChartOpen &&
            <FloatingButton
              setError={setError}
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
              setIsOpen={setIsOpen}
              isOpen={isOpen}
            />
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
