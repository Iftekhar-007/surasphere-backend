import { prisma } from "../../lib/prisma";
import AppError from "../../errorhelpers/AppError";
import status from "http-status";
import {
  IAssignTeacherPayload,
  IBlockUserPayload,
  ICreateSchedulePayload,
  IUpdateUserRolePayload,
  IVerifyStudentPayload,
} from "./admin.type";

const getDashboardStatsFromDB = async () => {
  const [
    totalUsers,
    totalStudents,
    totalTeachers,
    pendingVerifications,
    blockedUsers,
    totalTasks,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.studentProfile.count({ where: { verificationStatus: "PENDING" } }),
    prisma.user.count({ where: { OR: [{ status: "BLOCKED" }, { banned: true }] } }),
    prisma.homeTask.count(),
  ]);

  return {
    totalUsers,
    totalStudents,
    totalTeachers,
    pendingVerifications,
    blockedUsers,
    totalTasks,
  };
};

const getAllStudentsFromDB = async (searchTerm?: string, statusFilter?: string) => {
  const students = await prisma.studentProfile.findMany({
    where: {
      ...(statusFilter && { verificationStatus: statusFilter as any }),
      ...(searchTerm && {
        OR: [
          { user: { name: { contains: searchTerm, mode: "insensitive" } } },
          { user: { email: { contains: searchTerm, mode: "insensitive" } } },
          { user: { rollNumber: { contains: searchTerm, mode: "insensitive" } } },
        ],
      }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          rollNumber: true,
          role: true,
          status: true,
          banned: true,
          banReason: true,
          createdAt: true,
        },
      },
      assignedTeacher: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return students;
};

const getStudentDetailsByIdFromDB = async (studentProfileId: string) => {
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentProfileId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          rollNumber: true,
          role: true,
          status: true,
          banned: true,
          banReason: true,
          createdAt: true,
        },
      },
      assignedTeacher: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!student) {
    throw new AppError(status.NOT_FOUND, "Student profile not found.");
  }

  // Fetch student's progress, feedbacks, tasks, and schedules
  const [progressLogs, feedbacks, assignedTasks, schedules] = await Promise.all([
    prisma.dailyProgress.findMany({
      where: { studentId: student.userId },
      orderBy: { date: "desc" },
    }),
    prisma.dailyFeedback.findMany({
      where: { studentId: student.userId },
      include: {
        teacher: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { date: "desc" },
    }),
    prisma.studentHomeTask.findMany({
      where: { studentId: student.userId },
      include: {
        task: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.classSchedule.findMany({
      where: { studentId: student.userId },
      include: {
        teacher: { select: { id: true, name: true, email: true } },
      },
    }),
  ]);

  return {
    student,
    progressLogs,
    feedbacks,
    assignedTasks,
    schedules,
  };
};

const getAllTeachersFromDB = async (searchTerm?: string) => {
  const teachers = await prisma.teacherProfile.findMany({
    where: {
      ...(searchTerm && {
        OR: [
          { user: { name: { contains: searchTerm, mode: "insensitive" } } },
          { user: { email: { contains: searchTerm, mode: "insensitive" } } },
        ],
      }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          status: true,
          banned: true,
          banReason: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          students: true,
        },
      },
      students: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              rollNumber: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return teachers;
};

const getTeacherDetailsByIdFromDB = async (teacherProfileId: string) => {
  const teacher = await prisma.teacherProfile.findUnique({
    where: { id: teacherProfileId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          status: true,
          banned: true,
          banReason: true,
          createdAt: true,
        },
      },
      students: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              rollNumber: true,
            },
          },
        },
      },
    },
  });

  if (!teacher) {
    throw new AppError(status.NOT_FOUND, "Teacher profile not found.");
  }

  // Fetch reviews and schedules
  const [reviews, schedules, tasks] = await Promise.all([
    prisma.teacherReview.findMany({
      where: { teacherId: teacher.userId },
      include: {
        student: { select: { id: true, name: true, image: true, rollNumber: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.classSchedule.findMany({
      where: { teacherId: teacher.userId },
      include: {
        student: { select: { id: true, name: true } },
      },
    }),
    prisma.homeTask.findMany({
      where: { teacherId: teacher.userId },
      include: {
        _count: { select: { studentTasks: true } },
      },
    }),
  ]);

  const avgRating =
    reviews.length > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
      : 0;

  return {
    teacher,
    averageRating: avgRating,
    totalReviews: reviews.length,
    reviews,
    schedules,
    tasks,
  };
};

const verifyStudentProfileIntoDB = async (
  adminUserId: string,
  payload: IVerifyStudentPayload
) => {
  const student = await prisma.studentProfile.findUnique({
    where: { id: payload.studentProfileId },
  });

  if (!student) {
    throw new AppError(status.NOT_FOUND, "Student profile not found.");
  }

  const updatedProfile = await prisma.studentProfile.update({
    where: { id: payload.studentProfileId },
    data: {
      verificationStatus: payload.status,
      rejectionReason: payload.status === "REJECTED" ? (payload.rejectionReason || "Verification rejected by admin.") : null,
      verifiedAt: payload.status === "VERIFIED" ? new Date() : null,
      verifiedBy: payload.status === "VERIFIED" ? adminUserId : null,
      ...(payload.assignedTeacherId && { assignedTeacherId: payload.assignedTeacherId }),
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

  return updatedProfile;
};

const assignTeacherToStudentIntoDB = async (payload: IAssignTeacherPayload) => {
  const student = await prisma.studentProfile.findUnique({
    where: { id: payload.studentProfileId },
  });

  if (!student) {
    throw new AppError(status.NOT_FOUND, "Student profile not found.");
  }

  const teacher = await prisma.teacherProfile.findUnique({
    where: { id: payload.teacherProfileId },
  });

  if (!teacher) {
    throw new AppError(status.NOT_FOUND, "Teacher profile not found.");
  }

  const updatedStudent = await prisma.studentProfile.update({
    where: { id: payload.studentProfileId },
    data: {
      assignedTeacherId: payload.teacherProfileId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedTeacher: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return updatedStudent;
};

const blockOrUnblockUserIntoDB = async (payload: IBlockUserPayload) => {
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found.");
  }

  const updatedUser = await prisma.user.update({
    where: { id: payload.userId },
    data: {
      status: payload.isBlocked ? "BLOCKED" : "ACTIVE",
      banned: payload.isBlocked,
      banReason: payload.isBlocked ? payload.banReason || "Account blocked by administrator." : null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      banned: true,
      banReason: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const updateUserRoleIntoDB = async (payload: IUpdateUserRolePayload) => {
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found.");
  }

  const updatedUser = await prisma.user.update({
    where: { id: payload.userId },
    data: {
      role: payload.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  // Ensure corresponding profile exists
  if (payload.role === "TEACHER") {
    await prisma.teacherProfile.upsert({
      where: { userId: payload.userId },
      update: {},
      create: { userId: payload.userId },
    });
  } else if (payload.role === "STUDENT") {
    await prisma.studentProfile.upsert({
      where: { userId: payload.userId },
      update: {},
      create: { userId: payload.userId },
    });
  }

  return updatedUser;
};

const createScheduleIntoDB = async (payload: ICreateSchedulePayload) => {
  const schedule = await prisma.classSchedule.create({
    data: {
      title: payload.title,
      dayOfWeek: payload.dayOfWeek,
      startTime: payload.startTime,
      endTime: payload.endTime,
      meetingLink: payload.meetingLink,
      teacherId: payload.teacherId,
      studentId: payload.studentId,
    },
    include: {
      teacher: { select: { id: true, name: true, email: true } },
      student: { select: { id: true, name: true, email: true } },
    },
  });

  return schedule;
};

const getAllSchedulesFromDB = async () => {
  const schedules = await prisma.classSchedule.findMany({
    include: {
      teacher: { select: { id: true, name: true, email: true } },
      student: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return schedules;
};

export const AdminServices = {
  getDashboardStatsFromDB,
  getAllStudentsFromDB,
  getStudentDetailsByIdFromDB,
  getAllTeachersFromDB,
  getTeacherDetailsByIdFromDB,
  verifyStudentProfileIntoDB,
  assignTeacherToStudentIntoDB,
  blockOrUnblockUserIntoDB,
  updateUserRoleIntoDB,
  createScheduleIntoDB,
  getAllSchedulesFromDB,
};
