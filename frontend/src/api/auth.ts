import axios from "axios"
import { LoginDetails, SignUpDetails } from "../types"

const loginUrl = "https://hackathon-backend-k4qs0y5fc-matte23ns-projects.vercel.app/auth/login"
const signupUrl = "https://hackathon-backend-k4qs0y5fc-matte23ns-projects.vercel.app/auth/signup"

export const login = async (loginRequest: LoginDetails) => {
    return await axios.post(loginUrl, loginRequest)
}

export const signup = async (signupRequest: SignUpDetails) => {
    await axios.post(signupUrl, signupRequest)
}
