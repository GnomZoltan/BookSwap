import axiosInstance from "./axiosInstance";
import { CreateReviewDto } from "../types/Review";

const REVIEW_CONTROLLER = "/reviews";

export function getSentReviews(id: string) {
    return axiosInstance.get(
        REVIEW_CONTROLLER + `/reviewer/${id}`, 
        {
            withCredentials: true,
        }
    );
}

export function getReceivedReviews(id: string) {
    return axiosInstance.get(
        REVIEW_CONTROLLER + `/reviewed/${id}`, 
        {
            withCredentials: true,
        }
    );
}

export function createReview(createReviewDto: CreateReviewDto) {
    return axiosInstance.post(
        REVIEW_CONTROLLER,
        createReviewDto, 
        {
            withCredentials: true,
        }
    );
}