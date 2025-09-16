import { Router } from "express";
import { db } from "@/db";

export const commentRouter = Router();

commentRouter.get("/event/:eventId", async (req, res) => {
	const { eventId } = req.params;
	const data = await db.comment.findMany({
		where: {
			eventId,
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
	});
	return res.json(data);
});

commentRouter.post("/new", async (req, res) => {
	const { content, eventId, userId } = req.body;
	const data = await db.comment.create({
		data: {
			content,
			eventId,
			userId,
		},
	});
	return res.json(data);
});

commentRouter.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { content } = req.body;
	const data = await db.comment.update({
		where: {
			id,
		},
		data: {
			content,
		},
	});
	return res.json(data);
});

commentRouter.delete("/:id", async (req, res) => {
	const { id } = req.params;
	const data = await db.comment.delete({
		where: {
			id,
		},
	});
	return res.json(data);
});
