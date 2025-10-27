import { Clerk } from "@clerk/clerk-sdk-node";

export const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
