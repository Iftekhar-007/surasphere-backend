import { Router } from "express";
import { StudentRoutes } from "../module/students/student.route";
import { TeacherRoutes } from "../module/teacher/teacher.route";
import { AdminRoutes } from "../module/admin/admin.route";
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
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export const indexRoutes = router;
