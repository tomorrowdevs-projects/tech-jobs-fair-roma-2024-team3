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
    id: number
    name: string
    token: string
}

export interface Task {
    id: number
    userId: number
    name: string
    date: Date
    done: boolean
    repeat: string
}

export interface TaskRequest {
    id?: number
    userId: number
    name: string
    date: Date
    done: boolean
    repeat: string
}