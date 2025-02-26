import axiosInstance from "./axiosInstance";

const WISHLIST_CONTROLLER = "/wishlist";

export function addToWishlist(bookId: string) {
    return axiosInstance.post(
        WISHLIST_CONTROLLER, 
        { bookId },
        {
            withCredentials: true,
        }
    );
}

export function removeFromWishlist(bookId: string) {
    return axiosInstance.delete(
        WISHLIST_CONTROLLER + `/${bookId}`, 
        {
            withCredentials: true,
        }
    );
}

export function getUserWishlist() {
    return axiosInstance.get(
        WISHLIST_CONTROLLER + "/user", 
        {
            withCredentials: true,
        }
    );
}

export function checkStatus(bookId: string) {
    return axiosInstance.get(
        WISHLIST_CONTROLLER + `/status/${bookId}`, 
        {
            withCredentials: true,
        }
    );
}