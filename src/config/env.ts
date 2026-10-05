import dotenv from "dotenv";
// import AppError from "../app/errorHelpers/AppError";
import status from "http-status";
import AppError from "../app/errorhelpers/AppError";

dotenv.config();

interface EnvConfig {
  //   NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  //   ACCESS_TOKEN_SECRET: string;
  //   REFRESH_TOKEN_SECRET: string;
  //   ACCESS_TOKEN_EXPIRES_IN: string;
  //   REFRESH_TOKEN_EXPIRES_IN: string;
  //   BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: string;
  //   BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string;
  //   EMAIL_SENDER: {
  //     SMTP_USER: string;
  //     SMTP_PASS: string;
  //     SMTP_HOST: string;
  //     SMTP_PORT: string;
  //     SMTP_FROM: string;
  //   };
  //   GOOGLE_CLIENT_ID: string;
  //   GOOGLE_CLIENT_SECRET: string;
  //   GOOGLE_CALLBACK_API: string;
  //   FRONTEND_API: string;
  CLOUDINARY: {
    CLOUD_NAME: string;
    API_KEY: string;
    API_SECRET: string;
  };
  //   STRIPE: {
  //     SECRET_KEY: string;
  //     WEBHOOK_SECRET: string;
  //   };
}

const loadEnvVariables = (): EnvConfig => {
  const requireVars = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    // "ACCESS_TOKEN_SECRET",
    // "REFRESH_TOKEN_SECRET",
    // "ACCESS_TOKEN_EXPIRES_IN",
    // "REFRESH_TOKEN_EXPIRES_IN",
    // "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    // "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    // "EMAIL_SENDER_SMTP_USER",
    // "EMAIL_SENDER_SMTP_PASS",
    // "EMAIL_SENDER_SMTP_HOST",
    // "EMAIL_SENDER_SMTP_PORT",
    // "EMAIL_SENDER_SMTP_FROM",
    // "GOOGLE_CLIENT_ID",
    // "GOOGLE_CLIENT_SECRET",
    // "GOOGLE_CALLBACK_API",
    // "FRONTEND_API",
    // "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    // "STRIPE_SECRET_KEY",
    // "STRIPE_WEBHOOK_SECRET",
  ];

  requireVars.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not defined in .env file.`,
      );
    }
  });

  return {
    // NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || "5000",
    DATABASE_URL: process.env.DATABASE_URL!,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
    // ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    // REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
    // ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN!,
    // REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN!,
    // BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN:
    //   process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN!,

    // BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE:
    //   process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE!,

    // EMAIL_SENDER: {
    //   SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER!,
    //   SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS!,
    //   SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST!,
    //   SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT!,
    //   SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM!,
    // },

    // GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    // GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    // GOOGLE_CALLBACK_API: process.env.GOOGLE_CALLBACK_API!,
    // FRONTEND_API: process.env.FRONTEND_API!,

    CLOUDINARY: {
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      API_KEY: process.env.CLOUDINARY_API_KEY!,
      API_SECRET: process.env.CLOUDINARY_API_SECRET!,
    },
    // STRIPE: {
    //   SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    //   WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    // },
  };
};

export const envVars = loadEnvVariables();
