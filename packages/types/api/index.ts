export type APIRegisterResponse = {
    error?: APIError,
    jwt?: string
}

export type APILoginRequest = {
    email: string,
    password: string
}

export type APIError = {
    message: string,
    error?: string,
}
