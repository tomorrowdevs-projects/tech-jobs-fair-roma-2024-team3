import axios from "axios"
import { LoginDetails, SignUpDetails } from "../types"

const baseUrl = "https://hackathon-backend-git-main-matte23ns-projects.vercel.app"

const loginUrl = baseUrl + "/auth/login"
const signupUrl = baseUrl + "/auth/signup"

export const login = async (loginRequest: LoginDetails) => {
    return await axios.post(loginUrl, loginRequest)
}

export const signup = async (signupRequest: SignUpDetails) => {
    await axios.post(signupUrl, signupRequest)
}
