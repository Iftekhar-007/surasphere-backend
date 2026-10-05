import { Router } from "express";
import { checkAuth } from "../../middlewares/authMiddleware";
import { Role } from "../../../generated/prisma/client";
import { upload } from "../../utils/cloudinaryUpload";
import { validateRequest } from "../../middlewares/validateRequest";
import { StudentValidations } from "./student.validation";
import { StudentControllers } from "./student.controller";

const router = Router();

// All student routes require role: STUDENT
router.use(checkAuth(Role.STUDENT));

router.post(
  "/profile",
  upload.single("image"),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(StudentValidations.createStudentProfileValidationSchema),
  StudentControllers.createOrUpdateProfile
);

router.patch(
  "/profile",
  upload.single("image"),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(StudentValidations.updateStudentProfileValidationSchema),
  StudentControllers.createOrUpdateProfile
);

router.get("/profile", StudentControllers.getMyProfile);

router.get("/schedules", StudentControllers.getMySchedule);

router.get("/tasks", StudentControllers.getMyTasks);

router.post(
  "/tasks/:taskId/submit",
  upload.single("audio"),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(StudentValidations.submitTaskValidationSchema),
  StudentControllers.submitTask
);

router.get("/progress", StudentControllers.getMyProgress);

router.get("/feedbacks", StudentControllers.getMyFeedback);

router.post(
  "/reviews",
  validateRequest(StudentValidations.teacherReviewValidationSchema),
  StudentControllers.createOrUpdateTeacherReview
);

export const StudentRoutes = router;
