import express, { Application, Request, Response } from "express";
import { auth } from "./app/lib/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import status from "http-status";
import { indexRoutes } from "./app/Routes";
import { globalErrorHandler } from "./app/errorhelpers/globalErrorHandler";

import { envVars } from "./config/env";

const app: Application = express();
export const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://surahsphere.com",
  "https://www.surahsphere.com",
  envVars.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".surahsphere.com") ||
        origin === "https://surahsphere.com"
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Better Auth endpoint handler (Express 5 wildcard syntax: *splat)
app.all("/api/auth/*splat", toNodeHandler(auth));
app.all("/api/auth", toNodeHandler(auth));

// Middleware to parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Application modular routes
app.use("/api/v1", indexRoutes);

// Basic health check route
app.get("/", (req: Request, res: Response) => {
  res.status(status.OK).json({
    success: true,
    message: "SurahSphere API is running smoothly.",
    timestamp: new Date().toISOString(),
  });
});

// 404 Route handler
app.use((req: Request, res: Response) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "API Route Not Found",
    errorSources: [
      {
        path: req.originalUrl,
        message: "The requested endpoint does not exist on this server.",
      },
    ],
  });
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
