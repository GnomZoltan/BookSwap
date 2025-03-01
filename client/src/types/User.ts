export type User = {
    id: string;
    username: string;
    email: string;
    description: string;
    avgRating: number;
    photoUrl: string;
    createdAt: Date,
    updatedAt: Date,
    authMethod: string;
    role: string;
}

export type UpdateUserDto = {
    username?: string;
    email?: string;
    description?: string;
    photoUrl?: string;
}