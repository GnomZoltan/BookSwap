export type Book = {
    id: string;
    title: string;
    author: string;
    language: string;
    city: string;
    condition: string;
    forFree: boolean;
    description: string;
    createdAt : Date;
    updatedAt: Date;
    userId: string;
    status: string;
    genre: [
        {
            bookId: string;
            genreId: string;
            genre: {
                id: string;
                name: string;
            }
        }
    ];
    photos: [
        {
            id: string;
            photoUrl: string;
            bookId: string;
        }
    ];
}

export type AddBookDto = {
    title: string;
    author: string;
    language: string;
    city: string;
    condition: number;
    forFree: boolean;
    description: string;
    genreNames: string[];
    bookPhotos: string[];
}

export type UpdateBookDto = {
    title?: string;
    author?: string;
    language?: string;
    city?: string;
    condition?: number;
    forFree?: boolean;
    description?: string;
    genreNames?: string[];
    bookPhotos?: string[];
}