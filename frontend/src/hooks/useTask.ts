import { useState } from "react";
import { create, deleteById, findAll, findAllByUserIdAndDate, updateById } from "../api/task";
import { TaskRequest } from "../types";
import { z } from "zod";

export const TaskSchema = z.object({
    name: z.string()
        .min(1, { message: "Name is required" }),
});

const useTask = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const findTasks = async () => {
        const { data } = await findAll();
        return data
    }

    const findTasksByUserAndDate = async (userId: number, date: Date) => {
        const { data } = await findAllByUserIdAndDate(userId, date);
        return data
    }

    const updateTask = async (task: TaskRequest) => {
        setLoading(true)
        const { data } = await updateById(task);
        setLoading(false)
        return data
    }

    const createTask = async (task: TaskRequest) => {
        try {
            setLoading(true)
            const { data } = await create(task);
            setLoading(false)
            return data
        } catch (err) {
            setLoading(false)
            throw err
        }
    }

    const deleteTask = async (taskId: number) => {
        await deleteById(taskId);
    }

    return {
        findTasks,
        findTasksByUserAndDate,
        updateTask,
        createTask,
        deleteTask,
        loading
    }
}

export default useTask;