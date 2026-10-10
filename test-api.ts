import { prisma } from "./src/app/lib/prisma";
import { auth } from "./src/app/lib/auth";

async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users in DB:", users.map(u => ({ id: u.id, email: u.email, role: u.role, status: u.status })));
    const sessions = await prisma.session.findMany({ include: { user: true } });
    console.log("Sessions count:", sessions.length);

    // Let's find an admin user or create a session for the admin user
    const adminUser = users.find(u => u.role === "ADMIN");
    if (!adminUser) {
      console.log("No admin user found!");
      return;
    }

    console.log("Found admin user:", adminUser.email, adminUser.id);
    
    // Find active session for admin or create one
    let session = sessions.find(s => s.userId === adminUser.id);
    if (!session) {
      console.log("Creating new session for admin...");
      session = await prisma.session.create({
        data: {
          userId: adminUser.id,
          token: "test-admin-token-" + Date.now(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
        include: { user: true }
      });
    }

    console.log("Using session token:", session.token);

    const cookieHeader = `better-auth.session_token=${session.token}`;

    const studentsRes = await fetch("http://localhost:5000/api/v1/admin/students", {
      headers: {
        "Cookie": cookieHeader,
      }
    });
    const studentsData = await studentsRes.json();
    console.log("Students API status:", studentsRes.status, "Count:", studentsData.data?.length);

    if (studentsData.data?.length > 0) {
      const student = studentsData.data[0];
      console.log("Attempting to verify student:", student.id, "Current status:", student.verificationStatus);

      const verifyRes = await fetch("http://localhost:5000/api/v1/admin/verify-student", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookieHeader,
        },
        body: JSON.stringify({
          studentProfileId: student.id,
          status: "VERIFIED",
        }),
      });

      const verifyData = await verifyRes.json();
      console.log("Verify API status:", verifyRes.status, "Response:", JSON.stringify(verifyData, null, 2));
    }
  } catch (err) {
    console.error("Test Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
