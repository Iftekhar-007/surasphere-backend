import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TrialService } from "./trial.service";

const bookFreeTrial = catchAsync(async (req: Request, res: Response) => {
  const result = await TrialService.bookFreeTrial(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message:
      "Alhamdulillah! Your 3-day free trial request has been submitted. Our team will contact you shortly.",
    data: result,
  });
});

export const TrialController = {
  bookFreeTrial,
};
