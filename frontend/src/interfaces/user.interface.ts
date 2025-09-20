import type { Comment } from "./comment.interface";
import type { Event } from "./event.interface";

export interface User {
    id: string,
    username: string,
    enrolledEvents?: Event[],
    comments?: Comment[],
    createdAt: Date,
    updatedAt: Date
}