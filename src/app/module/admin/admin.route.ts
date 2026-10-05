import { Router } from "express";
import { checkAuth } from "../../middlewares/authMiddleware";
import { Role } from "../../../generated/prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { AdminValidations } from "./admin.validation";
import { AdminControllers } from "./admin.controller";

const router = Router();

// All admin routes require role: ADMIN
router.use(checkAuth(Role.ADMIN));

router.get("/dashboard-stats", AdminControllers.getDashboardStats);

router.get("/students", AdminControllers.getAllStudents);

router.get("/students/:studentProfileId", AdminControllers.getStudentDetailsById);

router.get("/teachers", AdminControllers.getAllTeachers);

router.get("/teachers/:teacherProfileId", AdminControllers.getTeacherDetailsById);

router.patch(
  "/verify-student",
  validateRequest(AdminValidations.verifyStudentValidationSchema),
  AdminControllers.verifyStudentProfile
);

router.patch(
  "/assign-teacher",
  validateRequest(AdminValidations.assignTeacherValidationSchema),
  AdminControllers.assignTeacherToStudent
);

router.patch(
  "/block-user",
  validateRequest(AdminValidations.blockUserValidationSchema),
  AdminControllers.blockOrUnblockUser
);

router.patch(
  "/update-role",
  validateRequest(AdminValidations.updateUserRoleValidationSchema),
  AdminControllers.updateUserRole
);

router.post(
  "/schedules",
  validateRequest(AdminValidations.createScheduleValidationSchema),
  AdminControllers.createSchedule
);

router.get("/schedules", AdminControllers.getAllSchedules);

export const AdminRoutes = router;
