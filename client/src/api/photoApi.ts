import axiosInstance from "./axiosInstance";

const PHOTO_CONTROLLER = "/book-photos";

export function uploadPhoto(formData: FormData) {
    return axiosInstance.post(
        `${PHOTO_CONTROLLER}/upload`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data", 
            },
            withCredentials: true,
        }
    );
}
