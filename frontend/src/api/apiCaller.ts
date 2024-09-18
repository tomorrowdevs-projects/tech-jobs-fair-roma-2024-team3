import axios from "axios"

const ApiCaller = () => {
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
        const token = localStorage.getItem("token");;
        config.headers.Authorization = token;

        return config;
    });
    return axios;

}

export default ApiCaller;