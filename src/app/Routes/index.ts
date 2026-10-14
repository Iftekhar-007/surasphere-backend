import { Router } from "express";
import { StudentRoutes } from "../module/students/student.route";
import { TeacherRoutes } from "../module/teacher/teacher.route";
import { AdminRoutes } from "../module/admin/admin.route";
import { TrialRoutes } from "../module/trial/trial.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/students",
    route: StudentRoutes,
  },
  {
    path: "/teachers",
    route: TeacherRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/trial",
    route: TrialRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const indexRoutes = router;
