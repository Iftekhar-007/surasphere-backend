import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import status from "http-status";
import { auth as betterAuthInstance } from "../lib/auth";
import { prisma } from "../lib/prisma";
import AppError from "../errorhelpers/AppError";
import { Role } from "../../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
    }
  }
}

export const checkAuth = (...requiredRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuthInstance.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session || !session.user) {
        throw new AppError(
          status.UNAUTHORIZED,
          "You are not logged in. Please sign in to continue."
        );
      }

      // Fetch fresh user data from DB to check current role and block status
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) {
        throw new AppError(status.UNAUTHORIZED, "User account not found.");
      }

      // Check if user is blocked or banned
      if (user.status === "BLOCKED" || user.banned) {
        throw new AppError(
          status.FORBIDDEN,
          user.banReason
            ? `Your account is blocked: ${user.banReason}`
            : "Your account has been blocked by an administrator."
        );
      }

      // Check role permissions
      const userRole = (user.role || "STUDENT") as Role;
      if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
        throw new AppError(
          status.FORBIDDEN,
          "You do not have permission to access this resource."
        );
      }

      req.user = user;
      req.session = session.session;
      next();
    } catch (error) {
      next(error);
    }
  };
};
