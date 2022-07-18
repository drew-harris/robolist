export interface APIRegisterResponse {
  error?: APIError;
  jwt?: string;
}

export interface APILoginRequest {
  email: string;
  password: string;
}

export interface APIError {
  message: string;
  error?: string;
}
