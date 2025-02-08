import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    timeout: 1000000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})

export default axiosInstance;