import type { Request, Response, NextFunction } from "express";
import { verifyIdToken } from "../lib/firebaseAdmin";
import { storage } from "../storage";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
      firebaseUid?: string;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    
    const decodedToken = await verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;
    
    const user = await storage.getUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(401).json({ error: "Unauthorized - User not found" });
    }

    req.firebaseUid = firebaseUid;
    req.userId = user.id;
    req.userRole = user.role;
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden - Admin access required" });
  }
  next();
}
