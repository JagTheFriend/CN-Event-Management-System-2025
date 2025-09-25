import type { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the token with Clerk
    const session = await clerkClient.sessions.verifySession(token, token);
    
    if (!session || !session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Add auth info to request
    req.auth = {
      userId: session.userId,
      sessionId: session.id
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const session = await clerkClient.sessions.verifySession(token, token);
        
        if (session && session.userId) {
          req.auth = {
            userId: session.userId,
            sessionId: session.id
          };
        }
      } catch (error) {
        // Ignore auth errors for optional auth
        console.log('Optional auth failed, continuing without auth');
      }
    }

    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};