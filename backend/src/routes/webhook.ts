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
      console.error("No primary email found for user:", id);
      return;
    }

    const user = await db.user.create({
      data: {
        id,
        email: primaryEmail.email_address,
        name: first_name && last_name ? `${first_name} ${last_name}`.trim() : first_name || last_name || null,
        imageUrl: image_url || null,
        role: "USER"
      }
    });

    console.log("Created user:", user.id);
  } catch (error) {
    // Handle case where user already exists
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      console.log("User already exists in database:", userData.id);
      return;
    }
    console.error("Error creating user:", error);
    throw error;
  }
}

// Handler for user.updated event
async function handleUserUpdated(userData: any) {
  try {
    const { id, email_addresses, first_name, last_name, image_url } = userData;

    const primaryEmail = email_addresses.find((email: any) => email.id === userData.primary_email_address_id);

    if (!primaryEmail) {
      console.error("No primary email found for user:", id);
      return;
    }

    const user = await db.user.update({
      where: { id },
      data: {
        email: primaryEmail.email_address,
        name: first_name && last_name ? `${first_name} ${last_name}`.trim() : first_name || last_name || null,
        imageUrl: image_url || null
      }
    });

    console.log("Updated user:", user.id);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Handler for user.deleted event
async function handleUserDeleted(userData: any) {
  try {
    const { id } = userData;

    // Delete user and all related data (enrollments, comments)
    // The CASCADE relations in the schema will handle related deletions
    await db.user.delete({
      where: { id }
    });

    console.log("Deleted user:", id);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// Health check endpoint for webhooks
webhookRouter.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: "ok", 
    message: "Webhook service is running",
    timestamp: new Date().toISOString()
  });
});