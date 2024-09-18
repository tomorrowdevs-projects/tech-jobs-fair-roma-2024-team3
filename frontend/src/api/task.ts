import { TaskRequest } from "../types";
import ApiCaller from "./apiCaller";

const baseUrl = import.meta.env.VITE_BASE_URL

const getTasksUrl = baseUrl + "/task/all" // GET
const getTasksByUserIdAndDateUrl = baseUrl + "/task/findByUserIdAndDate" // POST
const createTaskUrl = baseUrl + "/task/create" // POST
const updateTaskUrl = baseUrl + "/task/update/" // PUT
const deleteTaskUrl = baseUrl + "/task/delete/" // DELETE

export const findAll = async () => {
    return await ApiCaller().get(getTasksUrl);
};

export const findAllByUserIdAndDate = async (userId: number, date: Date) => {
    return await ApiCaller().post(getTasksByUserIdAndDateUrl, { userId, date: date.valueOf() });
};

export const create = async (createRequest: TaskRequest) => {
    return await ApiCaller().post(createTaskUrl, createRequest);
};

export const updateById = async (updateRequest: TaskRequest) => {
    return await ApiCaller().put(updateTaskUrl + updateRequest?.id?.toString(), updateRequest);
};

export const deleteById = async (taskId: number) => {
    return await ApiCaller().delete(deleteTaskUrl + taskId.toString());
};