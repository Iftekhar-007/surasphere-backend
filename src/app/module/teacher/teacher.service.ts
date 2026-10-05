import { prisma } from "../../lib/prisma";
import AppError from "../../errorhelpers/AppError";
import status from "http-status";
import {
  ICreateHomeTaskPayload,
  ICreateOrUpdateTeacherProfilePayload,
  IGiveDailyFeedbackPayload,
  IRecordDailyProgressPayload,
} from "./teacher.type";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

const getMyProfileFromDB = async (userId: string) => {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
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
          createdAt: true,
        },
      },
      _count: {
        select: {
          students: true,
        },
      },
    },
  });

  if (!teacherProfile) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        rollNumber: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    return { user, profile: null, studentCount: 0 };
  }

  return {
    ...teacherProfile,
    studentCount: teacherProfile._count.students,
  };
};

const updateProfileIntoDB = async (
  userId: string,
  payload: ICreateOrUpdateTeacherProfilePayload,
  file?: Express.Multer.File
) => {
  let imageUrl: string | undefined;
  if (file) {
    const uploadResult = await uploadToCloudinary(file, "surahsphere/teachers", "image");
    imageUrl = uploadResult.secure_url;
  }

  const { name, ...profileData } = payload;
  if (name || imageUrl) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(imageUrl && { image: imageUrl }),
      },
    });
  }

  const updatedProfile = await prisma.teacherProfile.upsert({
    where: { userId },
    update: {
      ...profileData,
    },
    create: {
      userId,
      ...profileData,
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
        },
      },
    },
  });

  return updatedProfile;
};

const getAssignedStudentsFromDB = async (teacherUserId: string) => {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId: teacherUserId },
  });

  if (!teacherProfile) {
    return {
      studentCount: 0,
      students: [],
    };
  }

  const students = await prisma.studentProfile.findMany({
    where: {
      assignedTeacherId: teacherProfile.id,
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
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    studentCount: students.length,
    students,
  };
};

const getAssignedStudentDetailsFromDB = async (
  teacherUserId: string,
  studentProfileId: string
) => {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId: teacherUserId },
  });

  if (!teacherProfile) {
    throw new AppError(status.NOT_FOUND, "Teacher profile not found.");
  }

  const student = await prisma.studentProfile.findFirst({
    where: {
      id: studentProfileId,
      assignedTeacherId: teacherProfile.id,
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
          createdAt: true,
        },
      },
    },
  });

  if (!student) {
    throw new AppError(
      status.FORBIDDEN,
      "You are only authorized to view students specifically assigned to you."
    );
  }

  // Fetch recent progress and feedback for this student
  const recentProgress = await prisma.dailyProgress.findMany({
    where: { studentId: student.userId },
    take: 10,
    orderBy: { date: "desc" },
  });

  const recentFeedback = await prisma.dailyFeedback.findMany({
    where: { studentId: student.userId, teacherId: teacherUserId },
    take: 10,
    orderBy: { date: "desc" },
  });

  return {
    student,
    recentProgress,
    recentFeedback,
  };
};

const createHomeTaskIntoDB = async (
  teacherUserId: string,
  payload: ICreateHomeTaskPayload
) => {
  const { title, description, surahName, startAyah, endAyah, dueDate, studentIds } = payload;

  // Create the main task
  const task = await prisma.homeTask.create({
    data: {
      title,
      description,
      surahName,
      startAyah,
      endAyah,
      dueDate: dueDate ? new Date(dueDate) : null,
      teacherId: teacherUserId,
      studentTasks: {
        createMany: {
          data: studentIds.map((studentId) => ({
            studentId,
            status: "ASSIGNED",
          })),
        },
      },
    },
    include: {
      studentTasks: {
        include: {
          student: {
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

  return task;
};

const getTeacherTasksFromDB = async (teacherUserId: string) => {
  const tasks = await prisma.homeTask.findMany({
    where: { teacherId: teacherUserId },
    include: {
      studentTasks: {
        include: {
          student: {
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

  return tasks;
};

const giveDailyFeedbackIntoDB = async (
  teacherUserId: string,
  payload: IGiveDailyFeedbackPayload
) => {
  const feedback = await prisma.dailyFeedback.create({
    data: {
      teacherId: teacherUserId,
      studentId: payload.studentId,
      performanceRating: payload.performanceRating,
      feedbackComment: payload.feedbackComment,
      mistakesNotes: payload.mistakesNotes,
      nextDayLesson: payload.nextDayLesson,
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return feedback;
};

const recordDailyProgressIntoDB = async (
  teacherUserId: string,
  payload: IRecordDailyProgressPayload
) => {
  const progress = await prisma.dailyProgress.create({
    data: {
      studentId: payload.studentId,
      sabqSurah: payload.sabqSurah,
      sabqAyahRange: payload.sabqAyahRange,
      sabqiSurah: payload.sabqiSurah,
      manzilJuz: payload.manzilJuz,
      memorizationScore: payload.memorizationScore,
      tajweedScore: payload.tajweedScore,
      notes: payload.notes,
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return progress;
};

const getMyReviewsFromDB = async (teacherUserId: string) => {
  const reviews = await prisma.teacherReview.findMany({
    where: { teacherId: teacherUserId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
      : 0;

  return {
    totalReviews: reviews.length,
    averageRating: Number(averageRating.toFixed(1)),
    reviews,
  };
};

export const TeacherServices = {
  getMyProfileFromDB,
  updateProfileIntoDB,
  getAssignedStudentsFromDB,
  getAssignedStudentDetailsFromDB,
  createHomeTaskIntoDB,
  getTeacherTasksFromDB,
  giveDailyFeedbackIntoDB,
  recordDailyProgressIntoDB,
  getMyReviewsFromDB,
};
