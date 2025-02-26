import axiosInstance from "./axiosInstance";

const BOOK_CONTROLLER = "/books";

export function getAllBooks() {
    return axiosInstance.get(
        BOOK_CONTROLLER, 
        {
            withCredentials: true,
        }
    );
}

export function getBookById(id: string) {
    return axiosInstance.get(
        `${BOOK_CONTROLLER}/${id}`, 
        {
            withCredentials: true,
        }
    );
}

export function getBooksByOwnerId(id: string) {
    return axiosInstance.get(
        `${BOOK_CONTROLLER}/owner/${id}`, 
        {
            withCredentials: true,
        }
    );
}