import type { User } from "./User";
export type Review = {
    id: number;
    summary: string;
    rating: number;
    createdAt: string; 
    userId?: number;
    reviewerId?: number;
    user: User;
    reviewer: User;
};