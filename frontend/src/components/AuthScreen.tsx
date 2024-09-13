import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { LoginDetails, SignUpDetails } from '../types';
import { z, ZodError } from 'zod';
import { AxiosError } from 'axios';
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';

const LoginSchema = z.object({
    username: z.string()
        .min(1, { message: "Username is required" }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters long" }),
});

const SignUpSchema = z.object({
    username: z.string()
        .min(1, { message: "Username is required" }),
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

const AuthScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null)
    const [loginDetails, setLoginDetails] = useState<LoginDetails>({ username: "", password: "" })
    const [signUpDetails, setSignUpDetails] = useState<SignUpDetails>({ username: "", password: "", confirmPassword: "" })
    const { signup, loading, setUser } = useAuth()
    const navigate = useNavigate()

    const handleAuth = async () => {
        setAuthError(null)
        try {
            if (isLogin) {
                LoginSchema.parse(loginDetails)
                // await login(loginDetails as LoginDetails)
                setUser({ username: "Omar" })
                localStorage.setItem("token", "test")
                navigate("/home")
            } else {
                SignUpSchema.parse(signUpDetails)
                await signup(signUpDetails as SignUpDetails)
                setIsLogin(true)
            }
            setLoginDetails({ username: "", password: "" })
            setSignUpDetails({ username: "", password: "", confirmPassword: "" })
        } catch (err) {
            if (err instanceof ZodError) {
                setAuthError(err.errors[0].message)
            } else if (err instanceof Error) {
                if (err instanceof AxiosError) {
                    setAuthError(err.status === 401 ? "Something went wrong" : "")
                } else {
                    setAuthError(err.message)
                }
            }
        }
    }

    const handleInput = (field: string, value: string) => {
        setAuthError(null);
        if (isLogin) {
            setLoginDetails(prevDetails => ({
                ...prevDetails,
                [field]: value
            }));
        } else {
            setSignUpDetails(prevDetails => ({
                ...prevDetails,
                [field]: value
            }));
        }
    };


    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        value={isLogin ? loginDetails.username : signUpDetails.username}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your username"
                        onChange={(e) => handleInput(e.currentTarget.name, e.currentTarget.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name='password'
                        value={isLogin ? loginDetails.password : signUpDetails.password}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your password"
                        onChange={(e) => handleInput(e.currentTarget.name, e.currentTarget.value)}
                    />
                    {isLogin && <p className='text-blue-500 underline italic text-sm mt-2'>Forgot password ?</p>}
                </div>

                {!isLogin && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            name="confirmPassword"
                            value={signUpDetails.confirmPassword}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Confirm your password"
                            onChange={(e) => handleInput(e.currentTarget.name, e.currentTarget.value)}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 md:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center"
                    onClick={handleAuth}
                >
                    {loading ? <Spinner /> : isLogin ? 'Login' : 'Sign Up'}
                </button>
                {!!authError && <p className='text-red-500 mt-2'>{authError}</p>}

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 hover:underline"
                    >
                        {isLogin ? 'Don\'t have an account? Sign up' : 'Already have an account? Log in'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
