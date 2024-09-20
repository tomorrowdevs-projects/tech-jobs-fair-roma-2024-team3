import { useState } from "react";
import { create, deleteById, findAll, getUserTasksByDate, updateById } from "../api/task";
import { Task, TaskRequest } from "../types";
import { z } from "zod";
import { atom } from "nanostores";
import { useStore } from "@nanostores/react";

export const $allTasks = atom<Task[]>([])

export const TaskSchema = z.object({
    name: z.string()
        .min(1, { message: "Name is required" }),
    date: z.date().refine((date) => date >= new Date(), {
        message: "Date must be today or in the future.",
    })
});

const useTask = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const allTasks = useStore($allTasks)

    const findTasks = async () => {

        try {
            setLoading(true)
            const { data } = await findAll();
            $allTasks.set(data)
            setLoading(false)
            return data
        } catch (err) {
            setLoading(false)
            throw err
        }
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
        allTasks,
        loading
    }
}

export default useTask;