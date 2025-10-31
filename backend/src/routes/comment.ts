import { Router } from "express";
import { db } from "@/db";
import { clerk } from "@/lib/clerk";
import { requireAuth } from "@/middleware/auth";

export const commentRouter = Router();

commentRouter.get("/event/:eventId", async (req, res) => {
	const { eventId } = req.params;
	const data = await db.comment.findMany({
		where: {
			eventId,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					imageUrl: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
	return res.json(data);
});

commentRouter.get("/user/:userId", async (req, res) => {
	const { userId } = req.params;
	const data = await db.comment.findMany({
		where: {
			userId,
		},
		include: {
			event: {
				select: {
					id: true,
					name: true,
					startDate: true,
					endDate: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
	return res.json(data);
});

commentRouter.post("/new", requireAuth, async (req, res) => {
	const { content, eventId } = req.body;
	const userId = req.auth?.userId;

	if (!userId) {
		return res.status(401).json({
			success: false,
			message: "Authentication required",
		});
	}

	// Check if user exists, if not auto-create with Clerk data
	let user = await db.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		// Fetch real user data from Clerk and auto-create in database
		try {
			console.log(
				"User not found in DB for comment, fetching from Clerk:",
				userId,
			);
			const clerkUser = await clerk.users.getUser(userId);

			// Extract user data from Clerk
			const email =
				clerkUser.emailAddresses.find(
					(e: any) => e.id === clerkUser.primaryEmailAddressId,
				)?.emailAddress ||
				clerkUser.emailAddresses[0]?.emailAddress ||
				`${userId}@example.com`;

			const name =
				clerkUser.firstName && clerkUser.lastName
					? `${clerkUser.firstName} ${clerkUser.lastName}`
					: clerkUser.firstName || clerkUser.username || null;

			const imageUrl = clerkUser.imageUrl || null;

			user = await db.user.create({
				data: {
					id: userId,
					email: email,
					name: name,
					imageUrl: imageUrl,
					role: "USER",
				},
			});
			console.log("Auto-created user in DB for comment:", {
				id: userId,
				email,
				name,
				imageUrl,
			});
		} catch (err) {
			console.error("Failed to fetch user from Clerk or create in DB:", err);
			return res.status(500).json({
				success: false,
				message: "Failed to auto-create user",
			});
		}
	}

	const data = await db.comment.create({
		data: {
			content,
			eventId,
			userId,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					imageUrl: true,
				},
			},
		},
	});
	return res.json({
		success: true,
		data,
	});
});

commentRouter.put("/edit/:id", requireAuth, async (req, res) => {
	const { id } = req.params;
	const { content } = req.body;
	const userId = req.auth?.userId;

	if (!userId) {
		return res.status(401).json({
			success: false,
			message: "Authentication required",
		});
	}

	// Check if the comment belongs to the user
	const existingComment = await db.comment.findUnique({
		where: { id: id! },
	});

	if (!existingComment) {
		return res.status(404).json({
			success: false,
			message: "Comment not found",
		});
	}

	if (existingComment.userId !== userId) {
		98;
		return res.status(403).json({
			success: false,
			message: "You can only edit your own comments",
		});
	}

	const data = await db.comment.update({
		where: {
			id: id!,
		},
		data: {
			content,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					imageUrl: true,
				},
			},
		},
	});
	return res.json({
		success: true,
		data,
	});
});

commentRouter.delete("/delete/:id", requireAuth, async (req, res) => {
	const { id } = req.params;
	const userId = req.auth?.userId;

	if (!userId) {
		return res.status(401).json({
			success: false,
			message: "Authentication required",
		});
	}

	// Check if the comment belongs to the user or user is admin
	const existingComment = await db.comment.findUnique({
		where: { id: id! },
	});

	if (!existingComment) {
		return res.status(404).json({
			success: false,
			message: "Comment not found",
		});
	}

	// Check if user is admin or owns the comment
	const user = await db.user.findUnique({
		where: { id: userId },
	});

	if (existingComment.userId !== userId && user?.role !== "ADMIN") {
		return res.status(403).json({
			success: false,
			message: "You can only delete your own comments",
		});
	}

	const data = await db.comment.delete({
		where: {
			id: id!,
		},
	});
	return res.json({
		success: true,
		message: "Comment deleted successfully",
	});
});
