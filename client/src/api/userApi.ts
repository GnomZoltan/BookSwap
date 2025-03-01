import axiosInstance from "./axiosInstance";
import { UpdateUserDto } from "../types/User";

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

export function updateMyself(updateUserDto: UpdateUserDto) {
    return axiosInstance.patch(
        USER_CONTROLLER,
        updateUserDto,
        {
            withCredentials: true,
        }
    );
}

export function deleteUser(id: string) {
    return axiosInstance.delete(
        `${USER_CONTROLLER}/${id}`,
        {
            withCredentials: true,
        }
    );
}