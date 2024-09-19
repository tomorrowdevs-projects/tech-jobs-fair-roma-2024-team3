import React, { useEffect, useState } from 'react';
import useAuth, { LoginSchema, SignUpSchema } from '../hooks/useAuth';
import { LoginDetails, SignUpDetails } from '../types';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import { PiEyeBold, PiEyeClosed } from 'react-icons/pi';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null)
    const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false)
    const [loginDetails, setLoginDetails] = useState<LoginDetails>({ email: "", password: "" })
    const [signUpDetails, setSignUpDetails] = useState<SignUpDetails>({ name: "", email: "", password: "", confirmPassword: "" })
    const { login, signup, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            navigate("/home")
        }
    }, [navigate])

    const handleAuth = async () => {
        setAuthError(null)
        try {
            if (isLogin) {
                LoginSchema.parse(loginDetails)
                const token = await login(loginDetails as LoginDetails)
                localStorage.setItem("token", token)
                navigate("/home")
            } else {
                SignUpSchema.parse(signUpDetails)
                await signup(signUpDetails as SignUpDetails)
                setIsLogin(true)
            }
        } catch (err) {
            if (err instanceof ZodError) {
                setAuthError(err.errors[0].message)
            } else if (err instanceof Error) {
                setAuthError(err.message)
            } else if (err instanceof AxiosError) {
                setAuthError("Ops, something went wrong!")
            } else {
                setAuthError(err as string)
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
        <div className="min-h-screen relative flex flex-col justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full p-4 max-w-[600px]">
                <form
                    onMouseDown={e => e.stopPropagation()}
                    onSubmit={e => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </h2>

                    {!isLogin &&
                        <div className='mb-4'>
                            <Input
                                id="name"
                                label='Name'
                                name="name"
                                value={signUpDetails.name}
                                placeholder="Enter your name"
                                onChange={handleInput}
                            />
                        </div>
                    }
                    <div className='mb-4'>
                        <Input
                            id="email"
                            label='Email'
                            type='email'
                            name="email"
                            value={isLogin ? loginDetails.email : signUpDetails.email}
                            placeholder="Enter your email"
                            onChange={handleInput}
                        />
                    </div>

                    <div className="mb-4 relative">
                        <Input
                            id="password"
                            type={`${isPasswordShown ? 'text' : 'password'}`}
                            name='password'
                            label='Password'
                            value={isLogin ? loginDetails.password : signUpDetails.password}
                            placeholder="Enter your password"
                            onChange={handleInput}
                        />
                        <div className='absolute top-[26px] right-0 flex justify-center items-center p-2' onClick={() => setIsPasswordShown((prev) => !prev)}>
                            {!isPasswordShown ? <PiEyeClosed size={25} color='#374151' /> :
                                <PiEyeBold size={25} color='#374151' />
                            }
                        </div>
                        {isLogin && <p className='text-blue-500 underline italic text-sm mt-2'>Forgot password ?</p>}
                    </div>

                    {!isLogin && (
                        <div className="mb-4 relative">
                            <Input
                                id="confirm-password"
                                type="password"
                                name="confirmPassword"
                                value={signUpDetails?.confirmPassword}
                                label='Confirm Password'
                                placeholder="Confirm your password"
                                onChange={handleInput}
                            />
                            <div className='absolute top-[26px] right-0 flex justify-center items-center p-2' onClick={() => setIsPasswordShown((prev) => !prev)}>
                                {!isPasswordShown ? <PiEyeClosed size={25} color='#374151' /> :
                                    <PiEyeBold size={25} color='#374151' />
                                }
                            </div>
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
                </form>
            </div>
        </div>
    );
};

export default AuthPage;