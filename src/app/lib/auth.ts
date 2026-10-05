import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, bearer } from "better-auth/plugins";
import { prisma } from "./prisma";
import { envVars } from "../../config/env";

export const auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5173",
    envVars.BETTER_AUTH_URL,
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      rollNumber: {
        type: "string",
        required: false,
        input: true,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "STUDENT",
        input: true,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
      },
    },
  },
  plugins: [
    admin({
      defaultRole: "STUDENT",
      adminRole: "ADMIN",
    }),
    bearer(),
  ],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    useSecureCookies: envVars.NODE_ENV === "production",
  },
});

export type Auth = typeof auth;
