import { Router } from "express";
import { checkAuth } from "../../middlewares/authMiddleware";
import { Role } from "../../../generated/prisma/client";
import { upload } from "../../utils/cloudinaryUpload";
import { validateRequest } from "../../middlewares/validateRequest";
import { TeacherValidations } from "./teacher.validation";
import { TeacherControllers } from "./teacher.controller";
const router = Router();
// All teacher routes require role: TEACHER
router.use(checkAuth(Role.TEACHER));
router.get("/profile", TeacherControllers.getMyProfile);
router.patch("/profile", upload.single("image"), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, validateRequest(TeacherValidations.updateTeacherProfileValidationSchema), TeacherControllers.updateProfile);
router.get("/students", TeacherControllers.getAssignedStudents);
router.get("/students/:studentProfileId", TeacherControllers.getAssignedStudentDetails);
router.post("/tasks", validateRequest(TeacherValidations.createHomeTaskValidationSchema), TeacherControllers.createHomeTask);
router.get("/tasks", TeacherControllers.getTeacherTasks);
router.post("/feedback", validateRequest(TeacherValidations.giveDailyFeedbackValidationSchema), TeacherControllers.giveDailyFeedback);
router.post("/progress", validateRequest(TeacherValidations.recordDailyProgressValidationSchema), TeacherControllers.recordDailyProgress);
router.get("/reviews", TeacherControllers.getMyReviews);
export const TeacherRoutes = router;
