import {
    getActivity as GetActivityRequest,
    updateActivity as UpdateActivityRequest,
    createActivity as CreateActivityRequest,
    deleteActivity as DeleteActivityRequest
} from "../api/activity";

const useActivity = () => {
    const activityUpdateTest = 
    {
        createdAt: "2024-09-17T13:00:19.230Z",
        done: true, 
        id: 2, 
        name: 'imparare a programmare con passione', 
        userId: 33, 
        date: '2024-09-17T13:00:14.579Z',
        updatedAt: "2024-09-17T13:00:19.230Z"
    }

    const currentDate = new Date();
    const dateRome = currentDate.toLocaleString("it-IT", {
        timeZone: 'Europe/Rome',
    })
    console.log(dateRome);
    
    const activityDeleteTest = {}
    const activityCreateTest = {
        name: 'imparare a programmare',
        userId: 33,
        date: new Date(),
    }
    
    
    const getActivity = async () => {
        try {
            const { data } = await GetActivityRequest();
            return data
        } catch (error) {
            throw error;
        }
    }

    const updateActivity = async (task:any) => {
        try {
            // task.done = !task.done || task.isDone = !task.isDone
            // const { data } = await UpdateActivityRequest(task);
            console.log('task------------------------------');
            console.log(task);
            
            const { data } = await UpdateActivityRequest(activityUpdateTest);
            console.log('data useAct');
            console.log(data);
            return data
        } catch (error) {
            throw error;
        }
    }

    const createActivity = async (task:any) => {
        console.log(task);
        
        try {
            const { data } = await CreateActivityRequest(activityCreateTest);
            return data
        } catch (error) {
            throw error;
        }
    }

    const deleteActivity = async () => {
        try {
            const { data } = await DeleteActivityRequest(activityDeleteTest);
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