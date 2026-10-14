import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { TrialValidations } from "./trial.validation";
import { TrialController } from "./trial.controller";

const router = Router();

// Public endpoint for students/visitors to book a 3-Day Free Trial
router.post(
  "/book",
  validateRequest(TrialValidations.bookTrialValidationSchema),
  TrialController.bookFreeTrial
);

export const TrialRoutes = router;
