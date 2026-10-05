import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getDashboardStatsFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin dashboard stats retrieved successfully.",
    data: result,
  });
});

const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const searchTerm = req.query.searchTerm as string | undefined;
  const statusFilter = req.query.status as string | undefined;

  const result = await AdminServices.getAllStudentsFromDB(searchTerm, statusFilter);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Students retrieved successfully.",
    data: result,
  });
});

const getStudentDetailsById = catchAsync(async (req: Request, res: Response) => {
  const studentProfileId = req.params.studentProfileId as string;
  const result = await AdminServices.getStudentDetailsByIdFromDB(studentProfileId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Student details retrieved successfully.",
    data: result,
  });
});

const getAllTeachers = catchAsync(async (req: Request, res: Response) => {
  const searchTerm = req.query.searchTerm as string | undefined;
  const result = await AdminServices.getAllTeachersFromDB(searchTerm);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Teachers retrieved successfully.",
    data: result,
  });
});

const getTeacherDetailsById = catchAsync(async (req: Request, res: Response) => {
  const teacherProfileId = req.params.teacherProfileId as string;
  const result = await AdminServices.getTeacherDetailsByIdFromDB(teacherProfileId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Teacher details retrieved successfully.",
    data: result,
  });
});

const verifyStudentProfile = catchAsync(async (req: Request, res: Response) => {
  const adminUserId = req.user.id;
  const payload = req.body;

  const result = await AdminServices.verifyStudentProfileIntoDB(adminUserId, payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Student profile verification updated successfully.",
    data: result,
  });
});

const assignTeacherToStudent = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AdminServices.assignTeacherToStudentIntoDB(payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Teacher assigned to student successfully.",
    data: result,
  });
});

const blockOrUnblockUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AdminServices.blockOrUnblockUserIntoDB(payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: payload.isBlocked ? "User blocked successfully." : "User unblocked successfully.",
    data: result,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AdminServices.updateUserRoleIntoDB(payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User role updated successfully.",
    data: result,
  });
});

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AdminServices.createScheduleIntoDB(payload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Class schedule created successfully.",
    data: result,
  });
});

const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getAllSchedulesFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Schedules retrieved successfully.",
    data: result,
  });
});

export const AdminControllers = {
  getDashboardStats,
  getAllStudents,
  getStudentDetailsById,
  getAllTeachers,
  getTeacherDetailsById,
  verifyStudentProfile,
  assignTeacherToStudent,
  blockOrUnblockUser,
  updateUserRole,
  createSchedule,
  getAllSchedules,
};
