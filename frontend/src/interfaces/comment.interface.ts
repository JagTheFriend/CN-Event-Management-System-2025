import type { Event } from "./event.interface";
import type { User } from "./user.interface";

export interface Comment {
    id: string,
    content: string,
    event: Event,
    user: User,
    createdAt: Date,
    updatedAt: Date
}