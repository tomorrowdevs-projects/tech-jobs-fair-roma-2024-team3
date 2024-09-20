import ApiCaller from "./apiCaller";
import { LoginDetails, SignUpDetails } from "../types"

const baseUrl = import.meta.env.VITE_BASE_URL

const loginUrl = baseUrl + "/auth/login"
const signupUrl = baseUrl + "/auth/signup"

export const login = async (loginRequest?: LoginDetails) => {
    return await ApiCaller().post(loginUrl, loginRequest)
}

export const signup = async (signupRequest: SignUpDetails) => {
    await ApiCaller().post(signupUrl, signupRequest)
}
