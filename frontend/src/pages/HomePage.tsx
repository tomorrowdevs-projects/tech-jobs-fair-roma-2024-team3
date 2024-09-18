import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FiPlus } from "react-icons/fi";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import { Task, TaskRequest } from "../types";
import Input from "../components/Input";
import useTask, { TaskSchema } from "../hooks/useTask";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GoTrash } from "react-icons/go";
import { deleteById } from "../api/task";
import { CiCalendar } from "react-icons/ci";
import { ZodError } from "zod";
import axios, { AxiosError } from "axios";
// import WeeklyRepeatC from "../components/WeeklyRepeatC";

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
  const [repeat, setRepeat] = useState("No Repeat");
//   const [dailyRepeat, setDailyRepeat] = useState(1);
  const [taskRequest, setTaskRequest] = useState<TaskRequest>({
    name: "",
    userId: 0,
    date: selectedDate ?? new Date(),
    done: false,
    repeat: repeat
  });
  const {
    createTask,
    updateTask,
    findTasksByUserAndDate,
    loading: taskLoading,
  } = useTask();
  console.log(selectedTask);

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

  const dates = generateDates(startDate);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getUser = async () => {
      if (token && !user) {
        try {
          const newToken = await login(undefined, token);
          localStorage.setItem("token", newToken);
        } catch (err) {
          console.log(err);
          localStorage.removeItem("token");
          navigate("/");
        }
      }
      if (!token || !user) {
        navigate("/");
      }
    };

    getUser();
  }, [login, navigate, user]);

  useEffect(() => {
    const getTasks = async () => {
      if (user?.id) {
        const tasks = await findTasksByUserAndDate(user.id, selectedDate);
        setTasks(tasks ?? []);
      }
    };

    getTasks();
  }, [selectedDate, user]);

  const isRepeat = (e: any) => {
    setRepeat(e.target.value);
    handleInput('repeat', e.target.value);
  };

  //   const updateWeek = (weeksDayupdate:any[])=>{
  //     console.log(weeksDayupdate);
  //   }

  const handleInput = (field: string, value: string) => {
    setError(null);
    setTaskRequest((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      TaskSchema.parse(taskRequest);
      if (!selectedTask) {
        const task = await createTask({
          ...taskRequest,
          userId: user?.id as number,
        });
        setTasks((prevTasks) => [
          ...(prevTasks?.length ? prevTasks : []),
          task,
        ]);
        setIsOpen(false);
      } else {
        const updatedTask = await updateTask({
          ...taskRequest,
          id: selectedTask?.id as number,
          userId: user?.id as number,
        });
        setSelectedTask(null);
        setTasks((prevTasks) =>
          prevTasks?.map((task) =>
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task
          )
        );
      }
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else if (err instanceof AxiosError) {
        setError("Ops, something went wrong!");
      } else {
        setError(err as string);
      }
    }
  };

  const registerServiceWorker = async () => {
    const register = await navigator.serviceWorker.register("/worker.js", {
      scope: "/",
    });

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicVapidKey,
    });

    await axios.post(baseUrl + "/subscribe", subscription, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  //   const showClock = () => {
//   let timerArray = [];
//   for (var i = 0; i < dailyRepeat; i++) {
//     const singleTimer = (
//       <Input
//         id={"timer-" + i}
//         label={"timer-" + i}
//         name="timer"
//         type="time"
//         value=""
//         placeholder=""
//         onChange={handleInput}
//       />
//     );
//     timerArray.push(singleTimer);
//   }
  // return timerArray;
  //   }

  if ("serviceWorker" in navigator) {
    registerServiceWorker().catch(console.log);
  }

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
          <div className="flex flex-col items-center justify-center gap-2 mt-4">
            <p>{startDate.toLocaleString("default", { month: "long" })}</p>
            <div className="flex items-center justify-center w-full">
              <button
                onClick={handlePrev}
                className="text-xl w-[40px] h-[40px] bg-gray-200 rounded-full hover:bg-gray-300 text-center"
              >
                ←
              </button>
              <div className="flex gap-1 p-2">
                {dates.map((date, index) => {
                  const isToday =
                    date.toDateString() === new Date().toDateString();
                  const isClicked =
                    date.toDateString() === selectedDate?.toDateString();
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedDate(date);
                        setTaskRequest((prev) => ({ ...prev, date }));
                      }}
                      className={`text-center w-[50px] h-[70px] rounded-full ${
                        isToday || (isToday && isClicked)
                          ? "bg-blue-500 text-white"
                          : ""
                      } ${
                        isClicked && !isToday
                          ? "border-blue-500 bg-white text-blue-500 border-[1px]"
                          : ""
                      } `}
                    >
                      <div className="font-bold">{date.getDate()}</div>
                      <div className="text-xs">
                        {date.toLocaleString("default", { weekday: "short" })}
                      </div>
                    </button>
                  );
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
          <div className="px-4 mt-8">
            {tasks?.map((t) => {
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  className={`${
                    t.done
                      ? "line-through bg-blue-500 text-white"
                      : "bg-white border-blue-500 text-blue-500"
                  } font-medium p-4 w-full border-[1px] rounded-md shadow-lg mt-4 cursor-pointer flex justify-between items-center`}
                >
                  <div className="flex items-center justify-center gap-4">
                    <div
                      className={`bg-white w-4 h-4 border-[1px] border-blue-500 rounded-md`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const completedTask = { ...t, done: !t.done };
                        updateTask(completedTask);
                        setTasks((prevTasks) =>
                          prevTasks?.map((task) =>
                            task.id === completedTask.id
                              ? { ...task, ...completedTask }
                              : task
                          )
                        );
                      }}
                    />
                    <p>{t.name}</p>
                  </div>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      deleteById(t.id);
                      setTasks((prevTasks) =>
                        prevTasks?.filter((task) => task.id !== t.id)
                      );
                    }}
                  >
                    <GoTrash size={20} />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              setError(null);
              if (selectedTask) {
                setSelectedTask(null);
              } else {
                setIsOpen((prev) => !prev);
              }
            }}
            className={`fixed flex justify-center items-center shadow-xl bottom-6 right-6 md:right-1/2 md:translate-x-[280px] rounded-full
                            ${
                              isOpen || selectedTask
                                ? "bg-red-500 transition duration-300 ease-in-out transform rotate-45"
                                : "bg-blue-500 transition duration-300 ease-in-out transform rotate-0"
                            } text-white z-30 w-[70px] h-[70px]`}
          >
            <FiPlus size={35} />
          </button>
        </div>
      </div>
      {(isOpen || selectedTask) && (
        <Fragment>
          <div className="absolute top-0 left-0 z-10 w-full h-screen bg-black opacity-30" />
          <div className="absolute top-0 left-0 z-20 flex items-center justify-center w-full h-screen">
            <div className="p-4 bg-white rounded-lg shadow-lg w-96">
              <h2 className="mb-6 text-2xl font-bold text-center">
                {selectedTask ? `Update ${selectedTask.name}` : "Add new task"}
              </h2>

              <div className="mb-4">
                <Input
                  id="name"
                  name="name"
                  label="Name"
                  placeholder="Enter task name"
                  onChange={handleInput}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="password"
                >
                  Pick a date
                </label>
                <div className="py-[6px] px-2 border-[1px] border-gray-200 shadow-md rounded-md relative">
                  <DatePicker
                    selected={taskRequest.date}
                    dateFormat={"dd/MM/yyyy"}
                    onChange={(date) => {
                      setError(null);
                      setTaskRequest((prevDetails) => ({
                        ...prevDetails,
                        date: date as Date,
                      }));
                    }}
                  />
                  <span className="absolute top-[8px] right-2">
                    <CiCalendar size={20} />
                  </span>
                </div>
              </div>

              <div>
                <form className="max-w-sm mx-auto">
                  <label
                    htmlFor="repeat"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Repeat
                  </label>
                  <select
                    id="repeat"
                    onChange={(e)=>isRepeat(e)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value='No Repeat' selected>No Repeat</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </form>
              </div>

              {/* <div className="flex items-center">
                <input
                  checked={repeat === "No Repeat"}
                  onClick={(e) => {
                    isRepeat(e);
                  }}
                  id="repeat-0"
                  type="radio"
                  value="No Repeat"
                  name="repeat"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="repeat-0"
                  className="text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
                >
                  No Repeat
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  onClick={(e) => {
                    isRepeat(e);
                  }}
                  id="repeat-1"
                  type="radio"
                  value="Daily"
                  name="repeat"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="repeat-1"
                  className="text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
                >
                  Daily
                </label>
              </div>
              <div className="flex items-center">
                <input
                  onClick={(e) => isRepeat(e)}
                  id="repeat-2"
                  type="radio"
                  value="Weekly"
                  name="repeat"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="repeat-2"
                  className="text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
                >
                  Weekly
                </label>
              </div>
              <div className="flex items-center">
                <input
                  onClick={(e) => isRepeat(e)}
                  id="repeat-3"
                  type="radio"
                  value="Monthly"
                  name="repeat"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="repeat-3"
                  className="text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
                >
                  Monthly
                </label>
              </div> */}

              {/* {repeat != "No Repeat" && (
                <div>
                  {repeat === "Daily" && (
                    <div>
                      <Input
                        onChange={handleInput}
                        placeholder=""
                        value={dailyRepeat.toString()}
                        type="number"
                        name="Daily Repeat"
                        label="How Many Time"
                        id="DailyR"
                      />
                      <div>
                        {timerArray}
                      </div>
                    </div>
                  )}
                  {repeat === "Weekly" && (
                    <WeeklyRepeatC updateWeek={updateWeek} />
                  )}

                </div>
              )} */}

              {/* 
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="confirm-password">
                                        Recursive
                                    </label>
                                    <select
                                        id="recursive"
                                        name="recursive"
                                        value={signUpDetails.confirmPassword}
                                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        placeholder="Confirm your password"
                                        onChange={(e) => handleInput(e.currentTarget.name, e.currentTarget.value)}
                                    />
                                </div> 
                            */}

              {error && <p className="mb-4 text-red-500">{error}</p>}

              <button
                disabled={taskLoading}
                className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-blue-500 rounded md:hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                onClick={handleSubmit}
              >
                {taskLoading ? <Spinner /> : null}
                {!taskLoading ? (selectedTask ? "Update" : "Create") : null}
              </button>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default HomePage;
