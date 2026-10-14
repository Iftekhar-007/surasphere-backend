import {
  IFreeTrialBookingData,
  sendFreeTrialConfirmationToStudent,
  sendFreeTrialNotificationToAdmin,
} from "../../utils/emailService";

const bookFreeTrial = async (payload: IFreeTrialBookingData) => {
  // 1. Send notification to Admin email directly
  const adminNotificationResult = await sendFreeTrialNotificationToAdmin(payload);

  // 2. Send instant acknowledgement confirmation email to Student
  const studentNotificationResult = await sendFreeTrialConfirmationToStudent(payload);

  return {
    submitted: true,
    data: {
      name: payload.name,
      email: payload.email,
      course: payload.course || "General Quran Studies",
    },
    adminEmailSent: adminNotificationResult.success,
    studentEmailSent: studentNotificationResult.success,
  };
};

export const TrialService = {
  bookFreeTrial,
};
