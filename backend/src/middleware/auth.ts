
import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.substring(7);
    try {
     
      const issuer = "https://bright-vervet-73.clerk.accounts.dev";
      const secretKey = process.env.CLERK_SECRET_KEY;
      console.log('--- Clerk Auth Debug ---');
      console.log('Token:', token);
      console.log('Issuer:', issuer);
      console.log('Secret Key present:', !!secretKey);
      if (!secretKey) {
        throw new Error('CLERK_SECRET_KEY is not set');
      }
      try {
        const payload = await verifyToken(token, {
          secretKey,
          issuer
        });
        if (!payload || !payload.sub) {
          return res.status(401).json({
            success: false,
            message: 'Invalid token payload'
          });
        }
        req.auth = {
          userId: payload.sub,
          sessionId: payload.sid
        };
        next();
        return; // Ensure no code below runs
      } catch (err) {
        console.error('Clerk token verification error:', err);
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token',
          error: err instanceof Error ? err.message : err
        });
      }
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
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
        const issuer = "https://bright-vervet-73.clerk.accounts.dev";
        const secretKey = process.env.CLERK_SECRET_KEY;
        console.log('--- Clerk Auth Debug (optionalAuth) ---');
        console.log('Token:', token);
        console.log('Issuer:', issuer);
        console.log('Secret Key present:', !!secretKey);
        if (!secretKey) {
          throw new Error('CLERK_SECRET_KEY is not set');
        }
        try {
          const payload = await verifyToken(token, {
            secretKey,
            issuer
          });
          if (payload && payload.sub) {
            req.auth = {
              userId: payload.sub,
              sessionId: payload.sid
            };
          }
        } catch (error) {
          console.log('Optional auth failed, continuing without auth:', error);
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