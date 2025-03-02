import axiosInstance from "./axiosInstance";
import { CreateRequestDto } from "../types/Request";

const REQUEST_CONTROLLER = "/exchange-requests";

export function getSentRequests(id: string) {
    return axiosInstance.get(
        REQUEST_CONTROLLER + `/sent/${id}`, 
        {
            withCredentials: true,
        }
    );
}

export function getReceivedRequests(id: string) {
    return axiosInstance.get(
        REQUEST_CONTROLLER + `/received/${id}`, 
        {
            withCredentials: true,
        }
    );
}

export function createRequest(createRequestDto: CreateRequestDto) {
    return axiosInstance.post(
        REQUEST_CONTROLLER, 
        createRequestDto,
        {
            withCredentials: true,
        }
    );
}

export function deleteRequest(id: string) {
    return axiosInstance.delete(
        `${REQUEST_CONTROLLER}/${id}`, 
        {
            withCredentials: true,
        }
    );
}

export function approveRequest(id: string) {
    return axiosInstance.patch(
        `${REQUEST_CONTROLLER}/approve/${id}`, 
        {
            withCredentials: true,
        }
    );
}

export function declineRequest(id: string) {
    return axiosInstance.patch(
        `${REQUEST_CONTROLLER}/decline/${id}`, 
        {
            withCredentials: true,
        }
    );
}