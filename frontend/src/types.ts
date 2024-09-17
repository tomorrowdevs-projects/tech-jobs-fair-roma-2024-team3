export interface LoginDetails {
    email: string
    password: string
}

export interface SignUpDetails {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export interface User {
    id: string
    name: string
    token: string
}

export interface Task {
    id: string
    name: string
    done: boolean
}