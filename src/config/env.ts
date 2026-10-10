import dotenv from "dotenv";
import status from "http-status";
import AppError from "../app/errorhelpers/AppError";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  FRONTEND_URL: string;
  EMAIL_SENDER: {
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_FROM: string;
  };
  CLOUDINARY: {
    CLOUD_NAME: string;
    API_KEY: string;
    API_SECRET: string;
  };
  ADMIN: {
    EMAIL: string;
    PASSWORD: string;
    NAME: string;
  };
}

const loadEnvVariables = (): EnvConfig => {
  const requireVars = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  requireVars.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not defined in .env file.`
      );
    }
  });

  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_SENDER_SMTP_USER || "";
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_SENDER_SMTP_PASS || "";
  const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_SENDER_SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || process.env.EMAIL_SENDER_SMTP_PORT || 587);
  const smtpFrom =
    process.env.SMTP_FROM ||
    process.env.EMAIL_SENDER_SMTP_FROM ||
    (smtpUser ? `"SurahSphere Academy" <${smtpUser}>` : '"SurahSphere Academy" <no-reply@surahsphere.com>');

  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || "5000",
    DATABASE_URL: process.env.DATABASE_URL!,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    EMAIL_SENDER: {
      SMTP_USER: smtpUser,
      SMTP_PASS: smtpPass,
      SMTP_HOST: smtpHost,
      SMTP_PORT: smtpPort,
      SMTP_FROM: smtpFrom,
    },
    CLOUDINARY: {
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      API_KEY: process.env.CLOUDINARY_API_KEY!,
      API_SECRET: process.env.CLOUDINARY_API_SECRET!,
    },
    ADMIN: {
      EMAIL: process.env.ADMIN_EMAIL || "tasnimian99@gmail.com",
      PASSWORD: process.env.ADMIN_PASSWORD || "Admin@123456",
      NAME: process.env.ADMIN_NAME || "Super Admin",
    },
  };
};

export const envVars = loadEnvVariables();
