import { Router, type Request, type Response } from "express";
import { Webhook } from "svix";
import { db } from "@/db";

export const webhookRouter = Router();

// Middleware to verify Clerk webhook signature
const verifyWebhook = (req: Request, res: Response, next: any) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  const headers = req.headers;
  const payload = req.body;

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(payload, headers as any);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  req.body = evt;
  next();
};

// Clerk user created webhook
webhookRouter.post("/clerk/user", verifyWebhook, async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;

    console.log("Received Clerk webhook:", type);

    switch (type) {
      case "user.created":
        await handleUserCreated(data);
        break;
      case "user.updated":
        await handleUserUpdated(data);
        break;
      case "user.deleted":
        await handleUserDeleted(data);
        break;
      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Handler for user.created event
async function handleUserCreated(userData: any) {
  try {
    const { id, email_addresses, first_name, last_name, image_url } = userData;

    const primaryEmail = email_addresses.find((email: any) => email.id === userData.primary_email_address_id);

    if (!primaryEmail) {
    // Clerk webhook logic removed.
      return;

    }
