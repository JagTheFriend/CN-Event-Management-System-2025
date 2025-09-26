import { Router } from "express";
import { db } from "@/db";
import { requireAuth, optionalAuth } from "@/middleware/auth";

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
					imageUrl: true
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
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
					endDate: true
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});
	return res.json(data);
});

commentRouter.post("/new", requireAuth, async (req, res) => {
	const { content, eventId } = req.body;
	const userId = req.auth?.userId;

	if (!userId) {
		return res.status(401).json({
			success: false,
			message: "Authentication required"
		});
	}

	// Check if user exists
	const user = await db.user.findUnique({
		where: { id: userId }
	});

	if (!user) {
		return res.status(404).json({
			success: false,
			message: "User not found"
		});
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
					imageUrl: true
				}
			}
		}
	});
	return res.json({
		success: true,
		data
	});
});

commentRouter.put("/edit/:id", requireAuth, async (req, res) => {
	const { id } = req.params;
	const { content } = req.body;
	const userId = req.auth?.userId;

	if (!userId) {
		return res.status(401).json({
			success: false,
			message: "Authentication required"
		});
	}

	// Check if the comment belongs to the user
	const existingComment = await db.comment.findUnique({
		where: { id }
	});

	if (!existingComment) {
		return res.status(404).json({
			success: false,
			message: "Comment not found"
		});
	}

	if (existingComment.userId !== userId) {
		return res.status(403).json({
			success: false,
			message: "You can only edit your own comments"
		});
	}

	const data = await db.comment.update({
		where: {
			id,
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
					imageUrl: true
				}
			}
		}
	});
	return res.json({
		success: true,
		data
	});
});

commentRouter.delete("/delete/:id", requireAuth, async (req, res) => {
	const { id } = req.params;
	const userId = req.auth?.userId;

	if (!userId) {
		return res.status(401).json({
			success: false,
			message: "Authentication required"
		});
	}

	// Check if the comment belongs to the user or user is admin
	const existingComment = await db.comment.findUnique({
		where: { id }
	});

	if (!existingComment) {
		return res.status(404).json({
			success: false,
			message: "Comment not found"
		});
	}

	// Check if user is admin or owns the comment
	const user = await db.user.findUnique({
		where: { id: userId }
	});

	if (existingComment.userId !== userId && user?.role !== 'ADMIN') {
		return res.status(403).json({
			success: false,
			message: "You can only delete your own comments"
		});
	}

	const data = await db.comment.delete({
		where: {
			id,
		},
	});
	return res.json({
		success: true,
		message: "Comment deleted successfully"
	});
});
