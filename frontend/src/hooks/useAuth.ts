import { LoginDetails, SignUpDetails, User } from "../types"
import { login as LoginRequest, signup as SignUpRequest } from "../api/auth"
import { useState } from "react"
import { atom } from "nanostores"
import { useStore } from "@nanostores/react"
import { z } from 'zod';


export const $user = atom<User | undefined>(undefined)

export const LoginSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required" })
        .email("Email is invalid"),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters long" }),
});

export const SignUpSchema = z.object({
    name: z.string()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name must be at most 50 characters long" })
        .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),
    email: z.string()
        .min(1, { message: "Email is required" })
        .email("Email is invalid"),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(50, { message: "Password must be max 50 characters long" })
        .refine(
            (value) => /^[^\s]*$/gm.test(value),
            "Password cannot contain spaces"
        ),
    confirmPassword: z
        .string()
        .min(1, "Confirm Password is required")
        .min(8, { message: "Confirm Password must be at least 8 characters long" })
        .max(50, { message: "Confirm Password must be max 50 characters long" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const useAuth = () => {
    const user = useStore($user)
    const [loading, setIsLoading] = useState<boolean>(false)

    const login = async (user?: LoginDetails) => {
        setIsLoading(true);
        try {
            const { data } = await LoginRequest(user);
            $user.set({ id: data?.id, name: data?.name, token: data?.token });
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