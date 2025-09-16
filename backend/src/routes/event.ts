import { Router } from "express";
import { db } from "@/db";

export const eventRouter = Router();

eventRouter.get("/", async (_req, res) => {
	const data = await db.event.findMany({
		orderBy: {
			startDate: "asc",
		},
	});
	return res.json(data);
});

eventRouter.get("/:id", async (req, res) => {
	const { id } = req.params;
	const data = await db.event.findUnique({
		where: {
			id,
		},
		include: {
			comments: true,
		},
	});
	return res.json(data);
});

eventRouter.post("/", async (req, res) => {
	const { name, description, startDate, endDate } = req.body;
	const data = await db.event.create({
		data: {
			name,
			description,
			startDate,
			endDate,
		},
	});
	return res.json(data);
});

eventRouter.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { name, description, startDate, endDate } = req.body;
	const data = await db.event.update({
		where: {
			id,
		},
		data: {
			name,
			description,
			startDate,
			endDate,
		},
	});
	return res.json(data);
});

eventRouter.delete("/:id", async (req, res) => {
	const { id } = req.params;
	const data = await db.event.delete({
		where: {
			id,
		},
	});
	return res.json(data);
});
