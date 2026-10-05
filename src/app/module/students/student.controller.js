import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StudentServices } from "./student.service";
const createOrUpdateProfile = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const payload = req.body;
    const file = req.file;
    const result = await StudentServices.createOrUpdateProfileIntoDB(userId, payload, file);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Student profile saved successfully.",
        data: result,
    });
});
const getMyProfile = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await StudentServices.getMyProfileFromDB(userId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Student profile retrieved successfully.",
        data: result,
    });
});
const getMySchedule = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await StudentServices.getMyScheduleFromDB(userId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Class schedules retrieved successfully.",
        data: result,
    });
});
const getMyTasks = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await StudentServices.getMyTasksFromDB(userId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Assigned home tasks retrieved successfully.",
        data: result,
    });
});
const submitTask = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const taskId = req.params.taskId;
    const payload = req.body;
    const file = req.file;
    const result = await StudentServices.submitTaskIntoDB(userId, taskId, payload, file);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Task submitted successfully.",
        data: result,
    });
});
const getMyProgress = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await StudentServices.getMyProgressFromDB(userId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Daily progress records retrieved successfully.",
        data: result,
    });
});
const getMyFeedback = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await StudentServices.getMyFeedbackFromDB(userId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Daily feedbacks retrieved successfully.",
        data: result,
    });
});
const createOrUpdateTeacherReview = catchAsync(async (req, res) => {
    const studentId = req.user.id;
    const payload = req.body;
    const result = await StudentServices.createOrUpdateTeacherReviewIntoDB(studentId, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Teacher review submitted successfully.",
        data: result,
    });
});
export const StudentControllers = {
    createOrUpdateProfile,
    getMyProfile,
    getMySchedule,
    getMyTasks,
    submitTask,
    getMyProgress,
    getMyFeedback,
    createOrUpdateTeacherReview,
};
