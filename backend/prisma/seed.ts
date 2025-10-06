import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("[v0] Starting seed...");

	// Create users
	const admin = await prisma.user.upsert({
		where: { id: "user_admin_123" },
		update: {},
		create: {
			id: "user_admin_123",
			email: "admin@example.com",
			name: "Admin User",
			role: "ADMIN",
		},
	});

	const eventManager = await prisma.user.upsert({
		where: { id: "user_manager_456" },
		update: {},
		create: {
			id: "user_manager_456",
			email: "manager@example.com",
			name: "Event Manager",
			role: "EVENT_MANAGER",
		},
	});

	const regularUser = await prisma.user.upsert({
		where: { id: "user_regular_789" },
		update: {},
		create: {
			id: "user_regular_789",
			email: "user@example.com",
			name: "Regular User",
			role: "USER",
		},
	});

	console.log("[v0] Created users");

	// Create events
	const event1 = await prisma.event.create({
		data: {
			name: "Tech Conference 2025",
			description:
				"Annual technology conference featuring the latest innovations",
			startDate: new Date("2025-06-15T09:00:00Z"),
			endDate: new Date("2025-06-17T18:00:00Z"),
			maxCapacity: 100,
			currentEnrolled: 2,
			userId: eventManager.id,
		},
	});

	const event2 = await prisma.event.create({
		data: {
			name: "Workshop: Web Development",
			description:
				"Hands-on workshop covering modern web development practices",
			startDate: new Date("2025-07-10T10:00:00Z"),
			endDate: new Date("2025-07-10T16:00:00Z"),
			maxCapacity: 30,
			currentEnrolled: 1,
			userId: eventManager.id,
		},
	});

	console.log("[v0] Created events");

	// Create enrollments
	await prisma.enrollment.create({
		data: {
			userId: admin.id,
			eventId: event1.id,
		},
	});

	await prisma.enrollment.create({
		data: {
			userId: regularUser.id,
			eventId: event1.id,
		},
	});

	await prisma.enrollment.create({
		data: {
			userId: regularUser.id,
			eventId: event2.id,
		},
	});

	console.log("[v0] Created enrollments");

	// Create comments
	await prisma.comment.create({
		data: {
			content: "Looking forward to this event!",
			userId: regularUser.id,
			eventId: event1.id,
		},
	});

	await prisma.comment.create({
		data: {
			content: "Great lineup of speakers this year.",
			userId: admin.id,
			eventId: event1.id,
		},
	});

	console.log("[v0] Seed completed successfully");
}

main()
	.catch((e) => {
		console.error("[v0] Error during seed:", e);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
