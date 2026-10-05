import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TeacherServices } from "./teacher.service";
const getMyProfile = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await TeacherServices.getMyProfileFromDB(userId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Teacher profile retrieved successfully.",
        data: result,
    });
});
const updateProfile = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const payload = req.body;
    const file = req.file;
    const result = await TeacherServices.updateProfileIntoDB(userId, payload, file);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Teacher profile updated successfully.",
        data: result,
    });
});
const getAssignedStudents = catchAsync(async (req, res) => {
    const teacherUserId = req.user.id;
    const result = await TeacherServices.getAssignedStudentsFromDB(teacherUserId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Assigned students retrieved successfully.",
        data: result,
    });
});
const getAssignedStudentDetails = catchAsync(async (req, res) => {
    const teacherUserId = req.user.id;
    const studentProfileId = req.params.studentProfileId;
    const result = await TeacherServices.getAssignedStudentDetailsFromDB(teacherUserId, studentProfileId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Student details retrieved successfully.",
        data: result,
    });
});
const createHomeTask = catchAsync(async (req, res) => {
    const teacherUserId = req.user.id;
    const payload = req.body;
    const result = await TeacherServices.createHomeTaskIntoDB(teacherUserId, payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Home task created and assigned successfully.",
        data: result,
    });
});
const getTeacherTasks = catchAsync(async (req, res) => {
    const teacherUserId = req.user.id;
    const result = await TeacherServices.getTeacherTasksFromDB(teacherUserId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Teacher tasks retrieved successfully.",
        data: result,
    });
});
const giveDailyFeedback = catchAsync(async (req, res) => {
    const teacherUserId = req.user.id;
    const payload = req.body;
    const result = await TeacherServices.giveDailyFeedbackIntoDB(teacherUserId, payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Daily feedback and next day lesson recorded successfully.",
        data: result,
    });
});
const recordDailyProgress = catchAsync(async (req, res) => {
    const teacherUserId = req.user.id;
    const payload = req.body;
    const result = await TeacherServices.recordDailyProgressIntoDB(teacherUserId, payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Daily progress recorded successfully.",
        data: result,
    });
});
const getMyReviews = catchAsync(async (req, res) => {
    const teacherUserId = req.user.id;
    const result = await TeacherServices.getMyReviewsFromDB(teacherUserId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Teacher reviews retrieved successfully.",
        data: result,
    });
});
export const TeacherControllers = {
    getMyProfile,
    updateProfile,
    getAssignedStudents,
    getAssignedStudentDetails,
    createHomeTask,
    getTeacherTasks,
    giveDailyFeedback,
    recordDailyProgress,
    getMyReviews,
};
