import axios from "axios";
import { TaskRequest } from "../types";

const baseUrl = "http://localhost:3001";

const getTasksUrl = baseUrl + "/task/all" // GET
const getTasksByUserIdAndDateUrl = baseUrl + "/task/findByUserIdAndDate" // POST
const createTaskUrl = baseUrl + "/task/create" // POST
const updateTaskUrl = baseUrl + "/task/update/" // PUT
const deleteTaskUrl = baseUrl + "/task/delete/" // DELETE

export const findAll = async () => {
    return await axios.get(getTasksUrl);
};

export const findAllByUserIdAndDate = async (userId: number, date: Date) => {
    return await axios.post(getTasksByUserIdAndDateUrl, { userId, date: date.valueOf() });
};

export const create = async (createRequest: TaskRequest) => {
    return await axios.post(createTaskUrl, createRequest);
};

export const updateById = async (updateRequest: TaskRequest) => {
    return await axios.put(updateTaskUrl + updateRequest?.id?.toString(), updateRequest);
};

export const deleteById = async (taskId: number) => {
    return await axios.delete(deleteTaskUrl + taskId.toString());
};