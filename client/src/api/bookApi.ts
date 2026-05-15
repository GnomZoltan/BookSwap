import axiosInstance from "./axiosInstance";
import { AddBookDto, UpdateBookDto } from "../types/Book";

const BOOK_CONTROLLER = "/books";

export function getAllBooks() {
    return axiosInstance.get(
        BOOK_CONTROLLER, 
        {
            withCredentials: true,
        }
    );
}

export function searchBooksByGenres(genreNames: string[]) {
    return axiosInstance.get(`${BOOK_CONTROLLER}/by-genres`, {
        params: { genres: genreNames.join(',') },
        withCredentials: true,
    });
}

export function searchBooks(query: string) {
    return axiosInstance.get(
        `${BOOK_CONTROLLER}/search`,
        {
            params: { query },
            withCredentials: true,
        }
    );
}

export function getAllAvailableBooks() {
    return axiosInstance.get(
        `${BOOK_CONTROLLER}/available`, 
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

export function addBook(addBookDto: AddBookDto) {
    return axiosInstance.post(
        BOOK_CONTROLLER, 
        addBookDto,
        {
            withCredentials: true,
        }
    );
}

export function deleteBook(id: string) {
    return axiosInstance.delete(
        `${BOOK_CONTROLLER}/${id}`, 
        {
            withCredentials: true,
        }
    );
}

export function updateBook(id:string, updateBookDto: UpdateBookDto) {
    return axiosInstance.patch(
        `${BOOK_CONTROLLER}/${id}`,
        updateBookDto,
        {
            withCredentials: true,
        }
    );
}

export function generateBookDescription(title: string, author: string) {
    return axiosInstance.post(
        `${BOOK_CONTROLLER}/generate-description`,
        { title, author },
        { withCredentials: true },
    );
}