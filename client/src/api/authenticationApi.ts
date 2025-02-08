import axiosInstance from "./axiosInstance";
import { AuthenticationDto, RegisterDto } from "../types/Authentication";

const AUTH_CONTROLLER = "/auth";

export function loginUser(authenticationDto: AuthenticationDto) {  
    return axiosInstance.post(
        AUTH_CONTROLLER + "/login", 
        authenticationDto, 
        {
            withCredentials: true,
        }
    );
}

export function registerUser(registerDto: RegisterDto) {
    return axiosInstance.post(
        AUTH_CONTROLLER + "/register", 
        registerDto, 
        {
            withCredentials: true,
        }
    );
}
  
export function refreshToken() {
    return axiosInstance.get(
        AUTH_CONTROLLER + "/refresh", 
        {
            withCredentials: true,
        }
    );
}

export function logout() {
    return axiosInstance.delete(
        AUTH_CONTROLLER + "/logout", 
        {
            withCredentials: true,
        }  
    );
}
  