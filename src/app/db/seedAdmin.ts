import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";
import { envVars } from "../../config/env";

export const seedAdmin = async () => {
  try {
    const adminEmail = envVars.ADMIN.EMAIL;
    const adminPassword = envVars.ADMIN.PASSWORD;
    const adminName = envVars.ADMIN.NAME;

    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: adminEmail,
      },
    });

    if (existingAdmin) {
      // If user exists, ensure they have ADMIN role and active status without altering their custom/updated password
      if (
        existingAdmin.role !== "ADMIN" ||
        !existingAdmin.emailVerified ||
        existingAdmin.status !== "ACTIVE"
      ) {
        await prisma.user.update({
          where: { email: adminEmail },
          data: {
            role: "ADMIN",
            emailVerified: true,
            status: "ACTIVE",
          },
        });
        console.log(
          `[Seed Admin]: Updated existing user "${adminEmail}" to ADMIN role with verified active status.`
        );
      } else {
        console.log(
          `[Seed Admin]: Admin user "${adminEmail}" already exists. Password is preserved for dynamic user changes.`
        );
      }
      return;
    }

    // Create admin user using Better Auth signUpEmail to hash password according to Better Auth auth standards
    console.log(`[Seed Admin]: Seeding admin user: ${adminEmail}...`);

    await auth.api.signUpEmail({
      body: {
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        requestedRole: "ADMIN",
      },
    });

    // Ensure role and verification are strictly set in database
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        role: "ADMIN",
        emailVerified: true,
        status: "ACTIVE",
      },
    });

    console.log(`[Seed Admin]: ✅ Admin account created successfully for "${adminEmail}" with ADMIN role.`);
  } catch (error) {
    console.error("[Seed Admin]: ❌ Failed to seed admin user:", error);
  }
};

// Allow running directly via CLI (e.g., `pnpm seed` or `tsx src/app/db/seedAdmin.ts`)
if (process.argv[1]?.includes("seedAdmin")) {
  seedAdmin()
    .then(() => {
      console.log("[Seed Admin]: Seed script execution finished.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("[Seed Admin]: Seed script execution error:", err);
      process.exit(1);
    });
}
