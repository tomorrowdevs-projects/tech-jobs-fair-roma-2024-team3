import { create, deleteById, findAll, findAllByUserIdAndDate, updateById } from "../api/task";
import { TaskRequest } from "../types";

const useTask = () => {
    // const activityUpdateTest = {
    //     createdAt: "2024-09-17T13:00:19.230Z",
    //     done: true,
    //     id: 2,
    //     name: 'imparare a programmare con passione',
    //     userId: 33,
    //     date: '2024-09-17T13:00:14.579Z',
    //     updatedAt: "2024-09-17T13:00:19.230Z"
    // }

    // const currentDate = new Date();
    // const dateRome = currentDate.toLocaleString("it-IT", {
    //     timeZone: 'Europe/Rome',
    // })

    // const activityCreateTest = {
    //     name: 'imparare a programmare',
    //     userId: 33,
    //     date: new Date(),
    // }


    const findTasks = async () => {
        const { data } = await findAll();
        return data
    }

    const findTasksByUserAndDate = async (userId: number, date: Date) => {
        const { data } = await findAllByUserIdAndDate(userId, date);
        return data
    }

    const updateTask = async (task: TaskRequest) => {
        const { data } = await updateById(task);
        return data
    }

    const createTask = async (task: TaskRequest) => {
        const { data } = await create(task);
        return data
    }

    const deleteTask = async (taskId: number) => {
        await deleteById(taskId);
    }

    return {
        findTasks,
        findTasksByUserAndDate,
        updateTask,
        createTask,
        deleteTask
    }
}

export default useTask;