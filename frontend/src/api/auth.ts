import axios from "axios"
import { LoginDetails, SignUpDetails } from "../types"

const baseUrl = "https://hackathon-backend-git-main-matte23ns-projects.vercel.app"

const loginUrl = baseUrl + "/auth/login"
const signupUrl = baseUrl + "/auth/signup"
const getTaskUrl = baseUrl + "/attivita/all"
// const getTaskUrl = "http://localhost:3001/attivita/all"

export const login = async (loginRequest: LoginDetails) => {
    console.log(loginRequest);
    
    return await axios.post(loginUrl, loginRequest)
}

export const signup = async (signupRequest: SignUpDetails) => {
    await axios.post(signupUrl, signupRequest)
}

export const getTask = async () => {
    console.log('check========================================');
    return await axios.get(getTaskUrl)
    // const boooo = await axios.get(getTaskUrl)
    // console.log('boooo');
    // console.log(boooo);
}
