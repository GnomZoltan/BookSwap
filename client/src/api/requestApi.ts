import axiosInstance from "./axiosInstance";

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