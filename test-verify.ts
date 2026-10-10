import { prisma } from "./src/app/lib/prisma";

async function main() {
  try {
    console.log("Connecting to DB...");
    const users = await prisma.user.findMany();
    console.log("Users found:", users.length);
    const students = await prisma.studentProfile.findMany({
      include: {
        user: true,
        assignedTeacher: true,
      }
    });
    console.log("Students found:", JSON.stringify(students, null, 2));

    if (students.length > 0) {
      const firstStudent = students[0];
      console.log("Testing update on student:", firstStudent.id);
      const updated = await prisma.studentProfile.update({
        where: { id: firstStudent.id },
        data: {
          verificationStatus: "VERIFIED",
          verifiedAt: new Date(),
          verifiedBy: users[0]?.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assignedTeacher: true,
        },
      });
      console.log("Update successful:", updated);
    }
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
