import axiosInstance from "./axiosInstance";

const USER_CONTROLLER = "/users";

export function getMyself() {
    return axiosInstance.get(
        USER_CONTROLLER + "/myself", 
        {
            withCredentials: true,
        }
    );
}

export function getSomeUser(id: string) {
    return axiosInstance.get(
        USER_CONTROLLER + `/${id}`, 
        {
            withCredentials: true,
        }
    );
}