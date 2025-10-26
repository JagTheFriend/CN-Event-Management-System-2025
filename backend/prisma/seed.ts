import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// SVG avatars for users
const avatars = [
	// Blue avatar
	`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%233B82F6' width='100' height='100'/%3E%3Ccircle cx='50' cy='35' r='15' fill='white'/%3E%3Cpath d='M 30 60 Q 50 75 70 60' stroke='white' stroke-width='4' fill='none'/%3E%3C/svg%3E`,
	// Purple avatar
	`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%238B5CF6' width='100' height='100'/%3E%3Ccircle cx='50' cy='30' r='18' fill='white'/%3E%3Crect x='25' y='55' width='50' height='35' rx='5' fill='white'/%3E%3C/svg%3E`,
	// Green avatar
	`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%2310B981' width='100' height='100'/%3E%3Cpolygon points='50,20 70,50 50,80 30,50' fill='white'/%3E%3C/svg%3E`,
	// Red avatar
	`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23EF4444' width='100' height='100'/%3E%3Ccircle cx='50' cy='40' r='12' fill='white'/%3E%3Ccircle cx='35' cy='65' r='10' fill='white'/%3E%3Ccircle cx='65' cy='65' r='10' fill='white'/%3E%3C/svg%3E`,
	// Orange avatar
	`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23F97316' width='100' height='100'/%3E%3Crect x='20' y='25' width='60' height='50' rx='8' fill='white'/%3E%3Ccircle cx='35' cy='70' r='8' fill='white'/%3E%3Ccircle cx='65' cy='70' r='8' fill='white'/%3E%3C/svg%3E`,
	// Pink avatar
	`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23EC4899' width='100' height='100'/%3E%3Cpath d='M 50 20 L 60 40 L 80 40 L 65 55 L 72 75 L 50 60 L 28 75 L 35 55 L 20 40 L 40 40 Z' fill='white'/%3E%3C/svg%3E`,
	// Teal avatar
	`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%2314B8A6' width='100' height='100'/%3E%3Ccircle cx='50' cy='50' r='25' fill='none' stroke='white' stroke-width='3'/%3E%3Ccircle cx='50' cy='50' r='15' fill='white'/%3E%3C/svg%3E`,
	// Indigo avatar
	`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%234F46E5' width='100' height='100'/%3E%3Crect x='25' y='20' width='50' height='60' fill='white'/%3E%3Ccircle cx='40' cy='75' r='8' fill='white'/%3E%3Ccircle cx='60' cy='75' r='8' fill='white'/%3E%3C/svg%3E`,
];

async function main() {
	console.log("🌱 Starting seed...");

	// Clear existing data
	await prisma.comment.deleteMany();
	await prisma.enrollment.deleteMany();
	await prisma.event.deleteMany();
	await prisma.user.deleteMany();

	// Create users with varying roles
	const users = await Promise.all([
		prisma.user.create({
			data: {
				id: "user_admin_001",
				email: "admin@example.com",
				name: "Alice Johnson",
				imageUrl: avatars[0],
				role: "ADMIN",
			},
		}),
		prisma.user.create({
			data: {
				id: "user_manager_001",
				email: "manager@example.com",
				name: "Bob Smith",
				imageUrl: avatars[1],
				role: "EVENT_MANAGER",
			},
		}),
		prisma.user.create({
			data: {
				id: "user_manager_002",
				email: "events@company.com",
				name: "Carol Williams",
				imageUrl: avatars[2],
				role: "EVENT_MANAGER",
			},
		}),
		prisma.user.create({
			data: {
				id: "user_001",
				email: "john.doe@example.com",
				name: "John Doe",
				imageUrl: avatars[3],
				role: "USER",
			},
		}),
		prisma.user.create({
			data: {
				id: "user_002",
				email: "jane.smith@example.com",
				name: "Jane Smith",
				imageUrl: avatars[4],
				role: "USER",
			},
		}),
		prisma.user.create({
			data: {
				id: "user_003",
				email: "michael.brown@example.com",
				name: "Michael Brown",
				imageUrl: avatars[5],
				role: "USER",
			},
		}),
		prisma.user.create({
			data: {
				id: "user_004",
				email: "sarah.davis@example.com",
				name: "Sarah Davis",
				imageUrl: avatars[6],
				role: "USER",
			},
		}),
		prisma.user.create({
			data: {
				id: "user_005",
				email: "david.miller@example.com",
				name: "David Miller",
				imageUrl: avatars[7],
				role: "USER",
			},
		}),
		prisma.user.create({
			data: {
				id: "user_006",
				email: "emma.wilson@example.com",
				name: "Emma Wilson",
				imageUrl: avatars[0],
				role: "USER",
			},
		}),
		prisma.user.create({
			data: {
				id: "user_007",
				email: "james.taylor@example.com",
				name: "James Taylor",
				imageUrl: avatars[1],
				role: "USER",
			},
		}),
	]);

	console.log(`✅ Created ${users.length} users`);

	// Create events with varying descriptions and capacities
	const events = await Promise.all([
		prisma.event.create({
			data: {
				name: "React Workshop",
				description:
					"Learn the fundamentals of React including hooks, state management, and component lifecycle. This comprehensive workshop covers everything you need to know to build modern React applications.",
				startDate: new Date("2025-01-15T09:00:00"),
				endDate: new Date("2025-06-15T17:00:00"),
				maxCapacity: 30,
				userId: users[1].id,
			},
		}),
		prisma.event.create({
			data: {
				name: "TypeScript Basics",
				description: "Introduction to TypeScript for beginners.",
				startDate: new Date("2026-02-20T10:00:00"),
				endDate: new Date("2026-04-20T12:00:00"),
				maxCapacity: 25,
				userId: users[2].id,
			},
		}),
		prisma.event.create({
			data: {
				name: "Advanced Node.js",
				description:
					"Deep dive into Node.js architecture, event loop, streams, and building scalable backend applications. Learn about clustering, load balancing, and production deployment strategies.",
				startDate: new Date("2025-10-01T14:00:00"),
				endDate: new Date("2025-11-01T18:00:00"),
				maxCapacity: 20,
				userId: users[1].id,
			},
		}),
		prisma.event.create({
			data: {
				name: "Web Design Trends 2024",
				description: "Explore the latest design trends and best practices.",
				startDate: new Date("2025-10-10T11:00:00"),
				endDate: new Date("2025-11-10T13:00:00"),
				maxCapacity: null,
				userId: users[2].id,
			},
		}),
		prisma.event.create({
			data: {
				name: "Database Optimization",
				description:
					"Master database optimization techniques including indexing strategies, query optimization, connection pooling, caching layers, and monitoring. We'll cover both SQL and NoSQL databases with real-world examples and performance benchmarks.",
				startDate: new Date("2024-03-15T09:00:00"),
				endDate: new Date("2025-03-15T17:00:00"),
				maxCapacity: 15,
				userId: users[1].id,
			},
		}),
		prisma.event.create({
			data: {
				name: "CSS Grid Mastery",
				description: "Learn CSS Grid layout system.",
				startDate: new Date("2024-03-20T15:00:00"),
				endDate: new Date("2026-03-20T16:30:00"),
				maxCapacity: 40,
				userId: users[2].id,
			},
		}),
		prisma.event.create({
			data: {
				name: "API Design Best Practices",
				description:
					"Comprehensive guide to designing RESTful and GraphQL APIs. Topics include versioning, authentication, rate limiting, error handling, documentation, and security considerations. Learn from real-world case studies and industry standards.",
				startDate: new Date("2024-04-01T10:00:00"),
				endDate: new Date("2024-04-01T12:00:00"),
				maxCapacity: 35,
				userId: users[1].id,
			},
		}),
		prisma.event.create({
			data: {
				name: "Testing Strategies",
				description: "Unit, integration, and e2e testing.",
				startDate: new Date("2026-04-05T13:00:00"),
				endDate: new Date("2026-04-05T15:00:00"),
				maxCapacity: 28,
				userId: users[2].id,
			},
		}),
		prisma.event.create({
			data: {
				name: "DevOps Fundamentals",
				description:
					"Introduction to DevOps practices, CI/CD pipelines, containerization with Docker, orchestration with Kubernetes, infrastructure as code, monitoring, and logging. Hands-on labs with real deployment scenarios.",
				startDate: new Date("2024-04-10T09:00:00"),
				endDate: new Date("2024-04-10T17:00:00"),
				maxCapacity: 20,
				userId: users[1].id,
			},
		}),
		prisma.event.create({
			data: {
				name: "Accessibility in Web Development",
				description: "WCAG standards and accessible design.",
				startDate: new Date("2026-04-15T14:00:00"),
				endDate: new Date("2026-04-15T16:00:00"),
				maxCapacity: null,
				userId: users[2].id,
			},
		}),
	]);

	console.log(`✅ Created ${events.length} events`);

	// Create enrollments
	const enrollments = await Promise.all([
		prisma.enrollment.create({
			data: {
				userId: users[3].id,
				eventId: events[0].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[4].id,
				eventId: events[0].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[5].id,
				eventId: events[0].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[3].id,
				eventId: events[1].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[6].id,
				eventId: events[1].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[4].id,
				eventId: events[2].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[7].id,
				eventId: events[2].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[8].id,
				eventId: events[2].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[3].id,
				eventId: events[3].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[5].id,
				eventId: events[3].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[9].id,
				eventId: events[3].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[4].id,
				eventId: events[4].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[6].id,
				eventId: events[4].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[3].id,
				eventId: events[5].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[7].id,
				eventId: events[5].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[8].id,
				eventId: events[5].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[5].id,
				eventId: events[6].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[9].id,
				eventId: events[6].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[4].id,
				eventId: events[7].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[6].id,
				eventId: events[7].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[3].id,
				eventId: events[8].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[7].id,
				eventId: events[8].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[8].id,
				eventId: events[8].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[5].id,
				eventId: events[9].id,
			},
		}),
		prisma.enrollment.create({
			data: {
				userId: users[9].id,
				eventId: events[9].id,
			},
		}),
	]);

	console.log(`✅ Created ${enrollments.length} enrollments`);

	const comments = await Promise.all([
		// Event 0: React Workshop (10 comments)
		prisma.comment.create({
			data: {
				content: "Great workshop! Really helped me understand hooks better.",
				userId: users[3].id,
				eventId: events[0].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"This was an excellent introduction to React. The instructor explained hooks in a way that finally made sense to me. I especially appreciated the practical examples and the Q&A session at the end.",
				userId: users[4].id,
				eventId: events[0].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Very informative. Looking forward to the advanced course!",
				userId: users[5].id,
				eventId: events[0].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The component lifecycle explanation was crystal clear. I'm already applying what I learned to my current project.",
				userId: users[6].id,
				eventId: events[0].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Loved the hands-on exercises!",
				userId: users[7].id,
				eventId: events[0].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Best React workshop I've attended. The instructor's knowledge and teaching style were exceptional. The materials provided are comprehensive and will be great for future reference.",
				userId: users[8].id,
				eventId: events[0].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Finally understand state management!",
				userId: users[9].id,
				eventId: events[0].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The workshop covered everything from basics to advanced patterns. I appreciated how the instructor answered all questions patiently and provided real-world use cases.",
				userId: users[3].id,
				eventId: events[0].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Excellent pacing and content delivery.",
				userId: users[4].id,
				eventId: events[0].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"This workshop was exactly what I needed to level up my React skills. The instructor was knowledgeable, engaging, and made complex concepts easy to understand. Highly recommended!",
				userId: users[5].id,
				eventId: events[0].id,
			},
		}),

		// Event 1: TypeScript Basics (10 comments)
		prisma.comment.create({
			data: {
				content:
					"The TypeScript basics course was perfect for someone like me who is just starting with TypeScript. The instructor covered type annotations, interfaces, and generics in a clear and concise manner.",
				userId: users[3].id,
				eventId: events[1].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Good content but could use more examples.",
				userId: users[6].id,
				eventId: events[1].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Finally understand how to use TypeScript properly! The exercises were challenging but not overwhelming. I would definitely recommend this course.",
				userId: users[7].id,
				eventId: events[1].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Great introduction to TypeScript.",
				userId: users[8].id,
				eventId: events[1].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The instructor made TypeScript accessible to beginners. I appreciated the focus on practical applications rather than just theory.",
				userId: users[9].id,
				eventId: events[1].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Interfaces and generics finally make sense!",
				userId: users[4].id,
				eventId: events[1].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Excellent course for TypeScript beginners. The instructor's explanations were clear and the examples were relevant to real-world scenarios.",
				userId: users[5].id,
				eventId: events[1].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Would love to see more advanced TypeScript topics next!",
				userId: users[3].id,
				eventId: events[1].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"This course gave me the confidence to start using TypeScript in my projects. The instructor was patient and thorough.",
				userId: users[6].id,
				eventId: events[1].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Perfect for beginners. Clear, concise, and practical.",
				userId: users[7].id,
				eventId: events[1].id,
			},
		}),

		// Event 2: Advanced Node.js (10 comments)
		prisma.comment.create({
			data: {
				content:
					"Advanced Node.js was mind-blowing! I learned so much about the event loop and how to properly handle async operations.",
				userId: users[4].id,
				eventId: events[2].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Loved it! The clustering section was particularly useful.",
				userId: users[7].id,
				eventId: events[2].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The deep dive into Node.js internals was exactly what I needed. The instructor's expertise was evident throughout the session.",
				userId: users[8].id,
				eventId: events[2].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Streams and buffers finally make sense!",
				userId: users[9].id,
				eventId: events[2].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"This workshop transformed my understanding of Node.js. The performance optimization techniques are already helping my applications.",
				userId: users[3].id,
				eventId: events[2].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Excellent technical depth and practical examples.",
				userId: users[5].id,
				eventId: events[2].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The event loop explanation was the best I've heard. The instructor made complex concepts accessible and engaging.",
				userId: users[6].id,
				eventId: events[2].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Production deployment strategies were invaluable!",
				userId: users[4].id,
				eventId: events[2].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Advanced Node.js workshop exceeded all my expectations. The instructor's real-world experience shone through in every topic covered.",
				userId: users[7].id,
				eventId: events[2].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Must-attend for any serious Node.js developer.",
				userId: users[8].id,
				eventId: events[2].id,
			},
		}),

		// Event 3: Web Design Trends 2024 (10 comments)
		prisma.comment.create({
			data: {
				content:
					"The design trends session was eye-opening. I appreciated how the speaker connected design principles with user psychology.",
				userId: users[3].id,
				eventId: events[3].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Interesting perspectives on modern web design.",
				userId: users[5].id,
				eventId: events[3].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The case studies from real companies were particularly valuable. I'm already implementing some of these trends in my designs.",
				userId: users[9].id,
				eventId: events[3].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Great insights on minimalism and dark mode design.",
				userId: users[4].id,
				eventId: events[3].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The speaker's passion for design was contagious. I left with fresh ideas and renewed inspiration for my projects.",
				userId: users[6].id,
				eventId: events[3].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Accessibility and design trends go hand in hand!",
				userId: users[7].id,
				eventId: events[3].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Excellent overview of 2024 design trends. The speaker provided actionable insights that I can apply immediately.",
				userId: users[8].id,
				eventId: events[3].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Love the focus on user experience and psychology.",
				userId: users[3].id,
				eventId: events[3].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"This session helped me understand the 'why' behind design trends, not just the 'what'. Very valuable perspective.",
				userId: users[5].id,
				eventId: events[3].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Perfect for designers and developers alike!",
				userId: users[9].id,
				eventId: events[3].id,
			},
		}),

		// Event 4: Database Optimization (10 comments)
		prisma.comment.create({
			data: {
				content:
					"Database optimization workshop exceeded my expectations. The performance benchmarks and real-world optimization techniques will directly help my application.",
				userId: users[4].id,
				eventId: events[4].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Indexing strategies were game-changing for my queries!",
				userId: users[6].id,
				eventId: events[4].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The instructor's experience with both SQL and NoSQL databases was evident. I learned so much about query optimization.",
				userId: users[7].id,
				eventId: events[4].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Connection pooling and caching concepts are now clear!",
				userId: users[8].id,
				eventId: events[4].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"This workshop will save my company thousands in database infrastructure costs. The optimization techniques are immediately applicable.",
				userId: users[9].id,
				eventId: events[4].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Monitoring and profiling tools recommendations were gold!",
				userId: users[3].id,
				eventId: events[4].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Excellent technical depth. The instructor provided both theoretical knowledge and practical implementation strategies.",
				userId: users[5].id,
				eventId: events[4].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Finally understand how to properly optimize my database!",
				userId: users[4].id,
				eventId: events[4].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The real-world case studies showed exactly how to apply these optimization techniques. Highly valuable workshop.",
				userId: users[6].id,
				eventId: events[4].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Must-attend for backend developers and DBAs!",
				userId: users[7].id,
				eventId: events[4].id,
			},
		}),

		// Event 5: CSS Grid Mastery (10 comments)
		prisma.comment.create({
			data: {
				content: "CSS Grid is now my favorite layout tool!",
				userId: users[3].id,
				eventId: events[5].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The instructor made CSS Grid accessible and fun. I'm already using it in all my new projects.",
				userId: users[7].id,
				eventId: events[5].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Grid vs Flexbox comparison was super helpful!",
				userId: users[8].id,
				eventId: events[5].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Finally understand when and how to use CSS Grid effectively. The practical examples were excellent.",
				userId: users[9].id,
				eventId: events[5].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Responsive grid layouts are now second nature!",
				userId: users[4].id,
				eventId: events[5].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The instructor's enthusiasm for CSS Grid was contagious. I left feeling confident in my grid skills.",
				userId: users[5].id,
				eventId: events[5].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Grid template areas and auto-placement are game-changers!",
				userId: users[6].id,
				eventId: events[5].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Perfect balance of theory and practice. The hands-on exercises really solidified my understanding.",
				userId: users[3].id,
				eventId: events[5].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "CSS Grid mastery achieved! Great workshop.",
				userId: users[7].id,
				eventId: events[5].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"This workshop transformed how I approach web layouts. CSS Grid is now my go-to solution for complex designs.",
				userId: users[8].id,
				eventId: events[5].id,
			},
		}),

		// Event 6: API Design Best Practices (10 comments)
		prisma.comment.create({
			data: {
				content:
					"The API design best practices course was comprehensive and well-structured. I learned about versioning strategies and proper error handling.",
				userId: users[5].id,
				eventId: events[6].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"GraphQL section was enlightening! I had only worked with REST before.",
				userId: users[9].id,
				eventId: events[6].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The security considerations section was crucial. I'm implementing these practices in all my APIs now.",
				userId: users[4].id,
				eventId: events[6].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Rate limiting and authentication best practices were invaluable!",
				userId: users[6].id,
				eventId: events[6].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The instructor provided real-world examples that made the concepts stick. Excellent course design.",
				userId: users[7].id,
				eventId: events[6].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Documentation best practices changed how I approach API design!",
				userId: users[8].id,
				eventId: events[6].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"This course should be mandatory for all backend developers. The knowledge is fundamental and immediately applicable.",
				userId: users[3].id,
				eventId: events[6].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "REST vs GraphQL comparison was eye-opening!",
				userId: users[5].id,
				eventId: events[6].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The instructor's experience designing APIs at scale was evident. Great insights and practical advice.",
				userId: users[9].id,
				eventId: events[6].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Best practices for API versioning and deprecation are now clear!",
				userId: users[4].id,
				eventId: events[6].id,
			},
		}),

		// Event 7: Testing Strategies (10 comments)
		prisma.comment.create({
			data: {
				content: "Testing strategies session was practical and actionable.",
				userId: users[4].id,
				eventId: events[7].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Unit, integration, and e2e testing are now part of my development workflow. Great course!",
				userId: users[6].id,
				eventId: events[7].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "The testing pyramid concept finally makes sense!",
				userId: users[7].id,
				eventId: events[7].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The instructor provided excellent examples using popular testing frameworks. Very practical and useful.",
				userId: users[8].id,
				eventId: events[7].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Code coverage and testing best practices are now my standard!",
				userId: users[9].id,
				eventId: events[7].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"This workshop improved my code quality significantly. Testing is now a priority in my projects.",
				userId: users[3].id,
				eventId: events[7].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Mocking and stubbing strategies were game-changing!",
				userId: users[5].id,
				eventId: events[7].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The instructor's passion for testing was inspiring. I left with renewed commitment to writing better tests.",
				userId: users[4].id,
				eventId: events[7].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "E2E testing tools and strategies are now part of my toolkit!",
				userId: users[6].id,
				eventId: events[7].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Essential knowledge for any developer. This course should be part of every development curriculum.",
				userId: users[7].id,
				eventId: events[7].id,
			},
		}),

		// Event 8: DevOps Fundamentals (10 comments)
		prisma.comment.create({
			data: {
				content:
					"DevOps fundamentals was an intensive but rewarding experience. The hands-on labs with Docker and Kubernetes were invaluable.",
				userId: users[3].id,
				eventId: events[8].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "CI/CD pipeline setup examples were exactly what I needed!",
				userId: users[7].id,
				eventId: events[8].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The instructor made DevOps accessible to developers without ops experience. Great teaching approach.",
				userId: users[8].id,
				eventId: events[8].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Docker containerization is now my standard deployment method!",
				userId: users[9].id,
				eventId: events[8].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Kubernetes orchestration concepts are now clear. The practical examples were excellent.",
				userId: users[4].id,
				eventId: events[8].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Infrastructure as code and monitoring strategies are game-changing!",
				userId: users[5].id,
				eventId: events[8].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"This workshop transformed my understanding of DevOps. I'm already implementing these practices in my team.",
				userId: users[6].id,
				eventId: events[8].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Logging and monitoring best practices are now my standard!",
				userId: users[3].id,
				eventId: events[8].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The instructor's real-world DevOps experience was evident throughout. Highly valuable workshop.",
				userId: users[7].id,
				eventId: events[8].id,
			},
		}),
		prisma.comment.create({
			data: {
				content: "Must-attend for developers looking to understand DevOps!",
				userId: users[8].id,
				eventId: events[8].id,
			},
		}),

		// Event 9: Accessibility in Web Development (10 comments)
		prisma.comment.create({
			data: {
				content: "Accessibility matters! This session opened my eyes.",
				userId: users[5].id,
				eventId: events[9].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"WCAG standards are now part of my development process. The instructor made accessibility practical and achievable.",
				userId: users[9].id,
				eventId: events[9].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Screen reader testing and keyboard navigation are now priorities!",
				userId: users[4].id,
				eventId: events[9].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The instructor's passion for inclusive design was inspiring. I'm committed to building accessible websites now.",
				userId: users[6].id,
				eventId: events[9].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"ARIA attributes and semantic HTML best practices are now clear!",
				userId: users[7].id,
				eventId: events[9].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"This workshop should be mandatory for all web developers. Accessibility is not optional.",
				userId: users[8].id,
				eventId: events[9].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Color contrast and font sizing for accessibility are now my standard!",
				userId: users[3].id,
				eventId: events[9].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"The real-world examples of inaccessible websites and how to fix them were eye-opening.",
				userId: users[5].id,
				eventId: events[9].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Accessibility testing tools and techniques are now part of my workflow!",
				userId: users[9].id,
				eventId: events[9].id,
			},
		}),
		prisma.comment.create({
			data: {
				content:
					"Building accessible websites is not just ethical, it's good business. This course convinced me completely.",
				userId: users[4].id,
				eventId: events[9].id,
			},
		}),
	]);

	console.log(`✅ Created ${comments.length} comments`);

	// Update enrollment counts
	for (const event of events) {
		const enrollmentCount = await prisma.enrollment.count({
			where: { eventId: event.id },
		});
		await prisma.event.update({
			where: { id: event.id },
			data: { currentEnrolled: enrollmentCount },
		});
	}

	console.log("✅ Updated enrollment counts");
	console.log("🎉 Seed completed successfully!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
