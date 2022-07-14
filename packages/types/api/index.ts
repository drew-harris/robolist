export type APIRegisterResponse = {
    error?: APIError,
    jwt?: String | null
}

export type APIError = {
    message: String,
    error?: String,
}
