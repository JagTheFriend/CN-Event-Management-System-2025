import type { Comment } from "./comment.interface"
import type { User } from "./user.interface"

export interface Event {
    id: string
    title: string,
    tagline: string,
    description: string,
    startDate: Date,
    endDate: Date,
    comments?: Comment[],
    users?: User[],
    createdAt: Date,
    updatedAt: Date
}