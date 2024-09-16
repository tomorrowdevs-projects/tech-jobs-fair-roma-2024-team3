import { LoginDetails, SignUpDetails, User } from "../types"
import { login as LoginRequest, signup as SignUpRequest } from "../api/auth"
import { useState } from "react"
import { atom } from "nanostores"
import { useStore } from "@nanostores/react"

export const $user = atom<User | undefined>(undefined)

const useAuth = () => {
    const user = useStore($user)
    const [loading, setIsLoading] = useState<boolean>(false)

    const login = async (user?: LoginDetails, token?: string) => {
        setIsLoading(true);
        try {
            const { data } = await LoginRequest(user, token);
            $user.set({ id: data?._id, name: data?.name, token: data?.token });
            setIsLoading(false);
            return data?.token;
        } catch (err) {
            setIsLoading(false);
            throw err;
        }
    };


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

    const logout = () => {
        localStorage.removeItem("token")
        $user.set(undefined)
    }

    return {
        user,
        loading,
        login,
        signup,
        logout
    }
}

export default useAuth