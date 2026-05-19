import axiosInstance from "./axiosInstance";

const GENRE_CONTROLLER = "/genres";

export function getAllGenres() {
    return axiosInstance.get(
        GENRE_CONTROLLER, 
        {
            withCredentials: true,
        }
    );
}

export function addGenre(name: string) {
    return axiosInstance.post(
        GENRE_CONTROLLER, 
        { name },
        {
            withCredentials: true,
        }
    );
}