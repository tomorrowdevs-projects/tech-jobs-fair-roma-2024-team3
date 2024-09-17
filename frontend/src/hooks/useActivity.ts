import {
    getActivity as GetActivityRequest,
    updateActivity as UpdateActivityRequest,
    createActivity as CreateActivityRequest,
    deleteActivity as DeleteActivityRequest
} from "../api/activity";

const useActivity = () => {
    const activityUpdateTest = {
        id: 2,
        nome: "Completare il progetto numero 2",
        done: true,
        createdAt: "2024-09-14T14:17:09.004Z",
        updatedAt: "2024-09-14T14:17:09.004Z",
    }
    const activityCreateTest = {
        nome: 'imparare a programmare',
        done: false,
        createdAt: new Date()
    }
    const getActivity = async () => {
        try {
            const { data } = await GetActivityRequest();
            return data
        } catch (error) {
            throw error;
        }
    }

    const updateActivity = async (id:any) => {
        try {
            const { data } = await UpdateActivityRequest(activityUpdateTest);
            console.log('data useAct');
            console.log(data);
            console.log('id = ', id);
            return data
        } catch (error) {
            throw error;
        }
    }

    const createActivity = async () => {
        try {
            const { data } = await CreateActivityRequest(activityCreateTest);
            return data
        } catch (error) {
            throw error;
        }
    }

    const deleteActivity = async () => {
        try {
            const { data } = await DeleteActivityRequest(activityUpdateTest);
            return data
        } catch (error) {
            throw error;
        }
    }

    return {
        getActivity,
        updateActivity,
        createActivity,
        deleteActivity
    }
}//end useActivity

export default useActivity;