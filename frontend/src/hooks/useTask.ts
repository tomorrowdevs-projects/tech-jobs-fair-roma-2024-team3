import { useState } from "react";
import { create, deleteById, findAll, getUserTasksByDate, updateById } from "../api/task";
import { TaskRequest } from "../types";
import { z } from "zod";

export const TaskSchema = z.object({
    name: z.string()
        .min(1, { message: "Name is required" }),
    date: z.date().refine((date)=>date>=new Date(),{
        message: "Date must be today or in the future.",
    })
});

const useTask = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const findTasks = async () => {
        const { data } = await findAll();
        return data
    }

    const findTasksByUserAndDate = async (userId: number, date: Date) => {
        try {
            setLoading(true)
            const { data } = await getUserTasksByDate(userId, date);
            setLoading(false)
            return data
        } catch (err) {
            setLoading(false)
            throw err
        }

    }

    const updateTask = async (task: TaskRequest) => {

        try {
            setLoading(true)
            const { data } = await updateById(task);
            setLoading(false)
            return data
        } catch (err) {
            setLoading(false)
            throw err
        }

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