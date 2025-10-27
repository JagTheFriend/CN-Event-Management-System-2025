import { Router } from "express";
import { db } from "@/db";
import { requireAuth } from "@/middleware/auth";
import { clerk } from "@/lib/clerk";

export const userRouter = Router();

// Apply auth middleware to all user routes
userRouter.use(requireAuth);

// Get current user profile
userRouter.get("/profile", async (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            event: true,
          },
        },
        comments: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get current user's enrolled events
userRouter.get("/enrolled-events", async (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const enrollments = await db.enrollment.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            user: true,
            _count: {
              select: {
                enrollments: true,
              },
            },
          },
        },
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });

    const events = enrollments.map((enrollment: any) => ({
      ...enrollment.event,
      enrolledAt: enrollment.enrolledAt,
    }));

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching enrolled events:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Enroll current user in an event
userRouter.post("/enroll/:eventId", async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { eventId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if user exists, if not, auto-create from Clerk JWT
    let user = await db.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      // Fetch real user data from Clerk and auto-create in database
      try {
        console.log("User not found in DB, fetching from Clerk:", userId);
        const clerkUser = await clerk.users.getUser(userId);

        // Extract user data from Clerk
        const email =
          clerkUser.emailAddresses.find(
            (e: any) => e.id === clerkUser.primaryEmailAddressId
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
        console.log("Auto-created user in DB:", {
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

    // Check if event exists
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if event has capacity limit and is full
    if (event.maxCapacity && event._count.enrollments >= event.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: "Event is at full capacity",
      });
    }

    // Check if user is already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "User is already enrolled in this event",
      });
    }

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId,
        eventId,
      },
      include: {
        event: true,
      },
    });

    // Update event's current enrolled count
    await db.event.update({
      where: { id: eventId },
      data: {
        currentEnrolled: {
          increment: 1,
        },
      },
    });

    res.status(201).json({
      success: true,
      data: enrollment,
      message: "Successfully enrolled in event",
    });
  } catch (error) {
    console.error("Error enrolling user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Unenroll current user from an event
userRouter.delete("/enroll/:eventId", async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { eventId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if enrollment exists
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Delete enrollment
    await db.enrollment.delete({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    // Update event's current enrolled count
    await db.event.update({
      where: { id: eventId },
      data: {
        currentEnrolled: {
          decrement: 1,
        },
      },
    });

    res.json({
      success: true,
      message: "Successfully unenrolled from event",
    });
  } catch (error) {
    console.error("Error unenrolling user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get enrollment status for a specific event for current user
userRouter.get("/enrollment-status/:eventId", async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { eventId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    res.json({
      success: true,
      data: {
        isEnrolled: !!enrollment,
        enrolledAt: enrollment?.enrolledAt || null,
      },
    });
  } catch (error) {
    console.error("Error checking enrollment status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Admin route: Get user profile by ID (requires admin role)
userRouter.get("/:id", async (req, res) => {
  try {
    const currentUserId = req.auth?.userId;
    const { id } = req.params;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if current user is admin or requesting their own profile
    const currentUser = await db.user.findUnique({
      where: { id: currentUserId },
    });

    if (
      !currentUser ||
      (currentUser.role !== "ADMIN" && currentUserId !== id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const user = await db.user.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            event: true,
          },
        },
        comments: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
