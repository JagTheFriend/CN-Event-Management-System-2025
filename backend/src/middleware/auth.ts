import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required",
      });
    }

    const token = authHeader.substring(7);
    const secretKey = process.env.CLERK_SECRET_KEY;
    // Extract issuer from publishable key or use environment variable
    const issuer =
      process.env.CLERK_ISSUER ||
      "https://generous-jackal-15.clerk.accounts.dev";

    console.log("--- Clerk Auth Debug ---");
    console.log("Token received:", !!token);
    console.log("Token preview:", token.substring(0, 20) + "...");
    console.log("Secret Key present:", !!secretKey);
    console.log("Issuer:", issuer);

    if (!secretKey) {
      console.error("CLERK_SECRET_KEY is not set in environment");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    try {
      const payload = await verifyToken(token, {
        secretKey,
        issuer,
      });

      console.log("Token verified successfully");
      console.log("User ID from token:", payload.sub);

      if (!payload || !payload.sub) {
        return res.status(401).json({
          success: false,
          message: "Invalid token payload",
        });
      }

      req.auth = {
        userId: payload.sub,
        ...(payload.sid && { sessionId: payload.sid as string }),
      };

      next();
    } catch (err) {
      console.error("Clerk token verification error:", err);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        error:
          process.env.NODE_ENV === "development"
            ? err instanceof Error
              ? err.message
              : String(err)
            : undefined,
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const secretKey = process.env.CLERK_SECRET_KEY;
      const issuer =
        process.env.CLERK_ISSUER ||
        "https://generous-jackal-15.clerk.accounts.dev";

      if (secretKey) {
        try {
          const payload = await verifyToken(token, {
            secretKey,
            issuer,
          });

          if (payload && payload.sub) {
            req.auth = {
              userId: payload.sub,
              ...(payload.sid && { sessionId: payload.sid as string }),
            };
          }
        } catch (error) {
          console.log("Optional auth failed, continuing without auth:", error);
        }
      }
    }
    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};
