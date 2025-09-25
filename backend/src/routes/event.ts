import { Router } from "express";
import { db } from "@/db";

export const eventRouter = Router();

eventRouter.get("/", async (_req, res) => {
	const data = await db.event.findMany({
		orderBy: {
			startDate: "asc",
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					imageUrl: true
				}
			},
			_count: {
				select: {
					enrollments: true,
					comments: true
				}
			}
		}
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
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					imageUrl: true
				}
			},
			comments: {
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
			},
			enrollments: {
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
			},
			_count: {
				select: {
					enrollments: true,
					comments: true
				}
			}
		},
	});
	return res.json(data);
});

eventRouter.post("/new", async (req, res) => {
	const { name, description, startDate, endDate, userId, maxCapacity } = req.body;
	const data = await db.event.create({
		data: {
			name,
			description,
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			userId,
			maxCapacity: maxCapacity || null,
			currentEnrolled: 0
		},
	});
	return res.json(data);
});

eventRouter.put("/edit/:id", async (req, res) => {
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

eventRouter.delete("/delete/:id", async (req, res) => {
	const { id } = req.params;
	const data = await db.event.delete({
		where: {
			id,
		},
	});
	return res.json(data);
});

// Get all enrollments for an event
eventRouter.get("/:id/enrollments", async (req, res) => {
	try {
		const { id } = req.params;
		
		const enrollments = await db.enrollment.findMany({
			where: {
				eventId: id
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
				enrolledAt: 'desc'
			}
		});

		res.json({
			success: true,
			data: enrollments
		});
	} catch (error) {
		console.error("Error fetching event enrollments:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
});

// Get enrollment statistics for an event
eventRouter.get("/:id/stats", async (req, res) => {
	try {
		const { id } = req.params;
		
		const event = await db.event.findUnique({
			where: { id },
			include: {
				_count: {
					select: {
						enrollments: true,
						comments: true
					}
				}
			}
		});

		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found"
			});
		}

		const stats = {
			totalEnrollments: event._count.enrollments,
			totalComments: event._count.comments,
			maxCapacity: event.maxCapacity,
			availableSpots: event.maxCapacity ? event.maxCapacity - event._count.enrollments : null,
			isFullyBooked: event.maxCapacity ? event._count.enrollments >= event.maxCapacity : false
		};

		res.json({
			success: true,
			data: stats
		});
	} catch (error) {
		console.error("Error fetching event stats:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
});
