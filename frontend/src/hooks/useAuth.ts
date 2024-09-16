import { LoginDetails, SignUpDetails, User } from "../types"
import { login as LoginRequest, signup as SignUpRequest } from "../api/auth"
import { useState } from "react"
import { atom } from "nanostores"
import { useStore } from "@nanostores/react"

export const $user = atom<User | undefined>(undefined)

const useAuth = () => {
    const user = useStore($user)
    const [loading, setIsLoading] = useState<boolean>(false)

    const login = async (user: LoginDetails) => {
        setIsLoading(true)
        try {
            const { data } = await LoginRequest(user)
            // $user.set(data)
            setIsLoading(false)
            return data?.token
        } catch (err) {
            setIsLoading(false)
            throw err
        }
    }

    const signup = async (user: SignUpDetails) => {
        setIsLoading(true)
        try {
            await SignUpRequest(user)
            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            console.log(err)
            throw err
        }
    }

    return {
        user,
        setUser: (data: User) => $user.set(data),
        loading,
        login,
        signup
    }
}

export default useAuth