import { PrismaClient, USER_ROLE } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Starting database seed...");

	// Create sample users
	const adminUser = await prisma.user.create({
		data: {
			id: "admin-user-1",
			role: USER_ROLE.ADMIN,
		},
	});

	const eventManager1 = await prisma.user.create({
		data: {
			id: "event-manager-1",
			role: USER_ROLE.EVENT_MANAGER,
		},
	});

	const eventManager2 = await prisma.user.create({
		data: {
			id: "event-manager-2",
			role: USER_ROLE.EVENT_MANAGER,
		},
	});

	const regularUser1 = await prisma.user.create({
		data: {
			id: "user-1",
			role: USER_ROLE.USER,
		},
	});

	const regularUser2 = await prisma.user.create({
		data: {
			id: "user-2",
			role: USER_ROLE.USER,
		},
	});

	const regularUser3 = await prisma.user.create({
		data: {
			id: "user-3",
			role: USER_ROLE.USER,
		},
	});

	console.log("✅ Created users");

	// Create sample events
	const techConference = await prisma.event.create({
		data: {
			name: "Tech Innovation Summit 2025",
			description:
				"A comprehensive conference covering the latest trends in technology, AI, and software development. Join industry leaders and innovators for networking and learning opportunities.",
			startDate: new Date("2025-03-15T09:00:00Z"),
			endDate: new Date("2025-03-17T18:00:00Z"),
			userId: eventManager1.id,
		},
	});

	const musicFestival = await prisma.event.create({
		data: {
			name: "Summer Music Festival",
			description:
				"Three days of incredible live music featuring local and international artists across multiple genres. Food trucks, art installations, and family-friendly activities.",
			startDate: new Date("2025-07-20T12:00:00Z"),
			endDate: new Date("2025-07-22T23:00:00Z"),
			userId: eventManager2.id,
		},
	});

	const workshopEvent = await prisma.event.create({
		data: {
			name: "Digital Marketing Workshop",
			description:
				"Hands-on workshop covering social media marketing, SEO strategies, and content creation. Perfect for small business owners and marketing professionals.",
			startDate: new Date("2025-02-10T10:00:00Z"),
			endDate: new Date("2025-02-10T16:00:00Z"),
			userId: eventManager1.id,
		},
	});

	const networkingEvent = await prisma.event.create({
		data: {
			name: "Professional Networking Mixer",
			description:
				"Connect with professionals from various industries in a relaxed atmosphere. Light refreshments and structured networking activities included.",
			startDate: new Date("2025-04-05T18:00:00Z"),
			endDate: new Date("2025-04-05T21:00:00Z"),
			userId: eventManager2.id,
		},
	});

	const charityRun = await prisma.event.create({
		data: {
			name: "Charity Fun Run 5K",
			description:
				"Annual charity run supporting local community programs. All fitness levels welcome. Registration includes t-shirt and post-race refreshments.",
			startDate: new Date("2025-05-12T08:00:00Z"),
			endDate: new Date("2025-05-12T12:00:00Z"),
			userId: eventManager1.id,
		},
	});

	console.log("✅ Created events");

	// Create sample comments
	await prisma.comment.createMany({
		data: [
			// Comments for Tech Conference
			{
				content:
					"This looks like an amazing lineup of speakers! Can't wait to attend the AI sessions.",
				userId: regularUser1.id,
				eventId: techConference.id,
			},
			{
				content:
					"Will there be recordings available for sessions we can't attend in person?",
				userId: regularUser2.id,
				eventId: techConference.id,
			},
			{
				content:
					"Great networking opportunity! Looking forward to meeting fellow developers.",
				userId: regularUser3.id,
				eventId: techConference.id,
			},

			// Comments for Music Festival
			{
				content:
					"The artist lineup is incredible this year! Already got my tickets.",
				userId: regularUser1.id,
				eventId: musicFestival.id,
			},
			{
				content:
					"Are there camping options available? Would love to stay for the full experience.",
				userId: regularUser2.id,
				eventId: musicFestival.id,
			},

			// Comments for Workshop
			{
				content:
					"Perfect timing for my small business launch. Will this cover e-commerce marketing too?",
				userId: regularUser3.id,
				eventId: workshopEvent.id,
			},
			{
				content:
					"Is there a beginner-friendly track? I'm new to digital marketing.",
				userId: regularUser1.id,
				eventId: workshopEvent.id,
			},

			// Comments for Networking Event
			{
				content:
					"Love these networking events! Met so many great contacts at the last one.",
				userId: regularUser2.id,
				eventId: networkingEvent.id,
			},

			// Comments for Charity Run
			{
				content: "Such a great cause! Signed up and already started training.",
				userId: regularUser1.id,
				eventId: charityRun.id,
			},
			{
				content:
					"Is there a virtual option for those who can't attend in person?",
				userId: regularUser3.id,
				eventId: charityRun.id,
			},
		],
	});

	console.log("✅ Created comments");

	// Create user enrollments (many-to-many relationship)
	await prisma.user.update({
		where: { id: regularUser1.id },
		data: {
			enrolledEvents: {
				connect: [
					{ id: techConference.id },
					{ id: workshopEvent.id },
					{ id: charityRun.id },
				],
			},
		},
	});

	await prisma.user.update({
		where: { id: regularUser2.id },
		data: {
			enrolledEvents: {
				connect: [
					{ id: musicFestival.id },
					{ id: networkingEvent.id },
					{ id: techConference.id },
				],
			},
		},
	});

	await prisma.user.update({
		where: { id: regularUser3.id },
		data: {
			enrolledEvents: {
				connect: [
					{ id: workshopEvent.id },
					{ id: charityRun.id },
					{ id: musicFestival.id },
				],
			},
		},
	});

	console.log("✅ Created user enrollments");

	console.log("🎉 Database seeded successfully!");
	console.log(`
📊 Seed Summary:
- Users: 6 (1 Admin, 2 Event Managers, 3 Regular Users)
- Events: 5 (Various types and dates)
- Comments: 10 (Distributed across events)
- Enrollments: 9 (Users enrolled in multiple events)
  `);
}

main()
	.catch((e) => {
		console.error("❌ Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
