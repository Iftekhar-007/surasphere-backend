import { prisma } from "../../lib/prisma";
import AppError from "../../errorhelpers/AppError";
import status from "http-status";
import {
  ICreateStudentProfilePayload,
  ICreateTeacherReviewPayload,
  ISubmitTaskPayload,
  IUpdateStudentProfilePayload,
} from "./student.type";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

const createOrUpdateProfileIntoDB = async (
  userId: string,
  payload: ICreateStudentProfilePayload | IUpdateStudentProfilePayload,
  file?: Express.Multer.File
) => {
  let imageUrl: string | undefined;
  if (file) {
    const uploadResult = await uploadToCloudinary(file, "surahsphere/students", "image");
    imageUrl = uploadResult.secure_url;
  }

  // Update user name/image if provided
  const { name, ...profileData } = payload as IUpdateStudentProfilePayload;
  if (name || imageUrl) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(imageUrl && { image: imageUrl }),
      },
    });
  }

  const existingProfile = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    const updatedProfile = await prisma.studentProfile.update({
      where: { userId },
      data: {
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
    return updatedProfile;
  }

  const newProfile = await prisma.studentProfile.create({
    data: {
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

  return newProfile;
};

const getMyProfileFromDB = async (userId: string) => {
  const profile = await prisma.studentProfile.findUnique({
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

  if (!profile) {
    // If no profile record exists yet, return base user info
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
    return { user, profile: null };
  }

  return profile;
};

const getMyScheduleFromDB = async (userId: string) => {
  const schedules = await prisma.classSchedule.findMany({
    where: {
      OR: [
        { studentId: userId },
        { studentId: null }, // or group sessions if assigned to teacher
      ],
      isActive: true,
    },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return schedules;
};

const getMyTasksFromDB = async (userId: string) => {
  const studentTasks = await prisma.studentHomeTask.findMany({
    where: { studentId: userId },
    include: {
      task: {
        include: {
          teacher: {
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

  return studentTasks;
};

const submitTaskIntoDB = async (
  userId: string,
  taskId: string,
  payload: ISubmitTaskPayload,
  file?: Express.Multer.File
) => {
  let audioUrl: string | undefined;
  if (file) {
    const uploadResult = await uploadToCloudinary(file, "surahsphere/audio_tasks", "video");
    audioUrl = uploadResult.secure_url;
  }

  const existingTask = await prisma.studentHomeTask.findUnique({
    where: {
      taskId_studentId: {
        taskId,
        studentId: userId,
      },
    },
  });

  if (!existingTask) {
    throw new AppError(status.NOT_FOUND, "Assigned task not found for this student.");
  }

  const updatedTask = await prisma.studentHomeTask.update({
    where: {
      taskId_studentId: {
        taskId,
        studentId: userId,
      },
    },
    data: {
      status: "SUBMITTED",
      submissionNote: payload.submissionNote,
      ...(audioUrl && { submissionAudioUrl: audioUrl }),
      submittedAt: new Date(),
    },
    include: {
      task: true,
    },
  });

  return updatedTask;
};

const getMyProgressFromDB = async (userId: string) => {
  const progressList = await prisma.dailyProgress.findMany({
    where: { studentId: userId },
    orderBy: {
      date: "desc",
    },
  });

  return progressList;
};

const getMyFeedbackFromDB = async (userId: string) => {
  const feedbacks = await prisma.dailyFeedback.findMany({
    where: { studentId: userId },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return feedbacks;
};

const createOrUpdateTeacherReviewIntoDB = async (
  studentId: string,
  payload: ICreateTeacherReviewPayload
) => {
  const teacher = await prisma.user.findUnique({
    where: { id: payload.teacherId, role: "TEACHER" },
  });

  if (!teacher) {
    throw new AppError(status.NOT_FOUND, "Teacher not found.");
  }

  const review = await prisma.teacherReview.upsert({
    where: {
      studentId_teacherId: {
        studentId,
        teacherId: payload.teacherId,
      },
    },
    update: {
      rating: payload.rating,
      comment: payload.comment,
    },
    create: {
      studentId,
      teacherId: payload.teacherId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return review;
};

export const StudentServices = {
  createOrUpdateProfileIntoDB,
  getMyProfileFromDB,
  getMyScheduleFromDB,
  getMyTasksFromDB,
  submitTaskIntoDB,
  getMyProgressFromDB,
  getMyFeedbackFromDB,
  createOrUpdateTeacherReviewIntoDB,
};
