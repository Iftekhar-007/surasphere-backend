import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, bearer } from "better-auth/plugins";
import { prisma } from "./prisma";
import { envVars } from "../../config/env";
import {
  sendNewUserSignupNotificationToAdmin,
  sendWelcomeEmailToUser,
} from "../utils/emailService";

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
      requestedRole: {
        type: "string",
        required: false,
        input: true,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Assign ADMIN if requested or passed, TEACHER if requested, otherwise default to STUDENT
          const requestedRole = (user as any).requestedRole;
          const currentRole = (user as any).role;
          const targetRole =
            currentRole === "ADMIN" || requestedRole === "ADMIN"
              ? "ADMIN"
              : requestedRole === "TEACHER"
              ? "TEACHER"
              : "STUDENT";
          return {
            data: {
              ...user,
              role: targetRole,
            },
          };
        },
        after: async (user) => {
          try {
            const role = (user as any).role;
            if (role === "TEACHER") {
              await prisma.teacherProfile.upsert({
                where: { userId: user.id },
                update: {},
                create: { userId: user.id },
              });
            } else if (role === "STUDENT") {
              await prisma.studentProfile.upsert({
                where: { userId: user.id },
                update: {},
                create: { userId: user.id },
              });
            }

            // Send notifications for new regular student/teacher registrations
            if (role === "STUDENT" || role === "TEACHER") {
              await Promise.allSettled([
                sendNewUserSignupNotificationToAdmin({
                  name: user.name,
                  email: user.email,
                  role: role,
                  rollNumber: (user as any).rollNumber,
                }),
                sendWelcomeEmailToUser({
                  name: user.name,
                  email: user.email,
                  role: role,
                  rollNumber: (user as any).rollNumber,
                }),
              ]);
            }
          } catch (error) {
            console.error("Error in user create hook / notification:", error);
          }
        },
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
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },
  advanced: {
    useSecureCookies: envVars.NODE_ENV === "production",
  },
});

export type Auth = typeof auth;
