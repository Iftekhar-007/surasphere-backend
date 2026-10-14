import nodemailer from "nodemailer";
import { envVars } from "../../config/env";

export interface INewUserEmailData {
  name: string;
  email: string;
  role: string;
  rollNumber?: string | null;
}

export interface IVerificationStatusEmailData {
  name: string;
  email: string;
  status: "VERIFIED" | "REJECTED";
  rejectionReason?: string | null;
}

export interface IFreeTrialBookingData {
  name: string;
  email: string;
  phone?: string | null;
  course?: string | null;
  ageGroup?: string | null;
  preferredTime?: string | null;
  message?: string | null;
}

const createTransporter = () => {
  if (!envVars.EMAIL_SENDER.SMTP_USER || !envVars.EMAIL_SENDER.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    port: envVars.EMAIL_SENDER.SMTP_PORT,
    secure: envVars.EMAIL_SENDER.SMTP_PORT === 465,
    auth: {
      user: envVars.EMAIL_SENDER.SMTP_USER,
      pass: envVars.EMAIL_SENDER.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Sends a "New Verification Request" notification email to Admin
 */
export const sendNewUserSignupNotificationToAdmin = async (
  userData: INewUserEmailData
) => {
  const adminEmail = envVars.ADMIN.EMAIL;
  const adminName = envVars.ADMIN.NAME;
  const portalUrl = `${envVars.FRONTEND_URL}/portal/admin`;

  const roleBadgeColor = userData.role === "TEACHER" ? "#047857" : "#1D4ED8";
  const roleName =
    userData.role === "TEACHER"
      ? "Teacher / Instructor"
      : userData.role === "STUDENT"
      ? "Quran Student"
      : userData.role;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Verification Request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8EFE3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #171713;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8EFE3; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFDF7; border-radius: 24px; border: 1px solid #D9C8A8; box-shadow: 0 10px 30px rgba(18, 56, 24, 0.08); overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #123818 0%, #0B2811 100%); padding: 35px 30px; text-align: center; border-bottom: 3px solid #D6B866;">
              <h1 style="margin: 0; color: #FFFDF7; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">SurahSphere</h1>
              <p style="margin: 6px 0 0 0; color: #D6B866; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">Administration Portal</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 35px 30px;">
              <div style="display: inline-block; background-color: #FEF3C7; color: #92400E; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 18px; border: 1px solid #FCD34D;">
                ⏳ New Verification Request
              </div>

              <p style="margin: 0 0 12px 0; font-size: 15px; color: #696355; font-weight: 600;">
                Assalamu Alaikum <strong>${adminName}</strong>,
              </p>

              <h2 style="margin: 0 0 16px 0; color: #123818; font-size: 21px; font-weight: 700; line-height: 1.4;">
                A new user registration requires your verification
              </h2>

              <p style="margin: 0 0 24px 0; font-size: 14px; color: #4A463B; line-height: 1.6;">
                A new user has submitted a registration request on SurahSphere. Please review their credentials below and verify or reject their account in the administrative portal.
              </p>

              <!-- User Details Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8EFE3; border-radius: 16px; border: 1px solid #D9C8A8; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 22px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 7px 0; font-size: 13px; color: #696355; font-weight: 600; width: 140px;">Applicant Name:</td>
                        <td style="padding: 7px 0; font-size: 14px; color: #123818; font-weight: 700;">${userData.name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 7px 0; font-size: 13px; color: #696355; font-weight: 600;">Email Address:</td>
                        <td style="padding: 7px 0; font-size: 14px; color: #123818; font-weight: 600;">${userData.email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 7px 0; font-size: 13px; color: #696355; font-weight: 600;">Applied Role:</td>
                        <td style="padding: 7px 0;">
                          <span style="display: inline-block; background-color: ${roleBadgeColor}; color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 3px 12px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${roleName}
                          </span>
                        </td>
                      </tr>
                      ${
                        userData.rollNumber
                          ? `<tr>
                        <td style="padding: 7px 0; font-size: 13px; color: #696355; font-weight: 600;">Roll / ID:</td>
                        <td style="padding: 7px 0; font-size: 14px; color: #123818; font-weight: 600; font-family: monospace;">${userData.rollNumber}</td>
                      </tr>`
                          : ""
                      }
                      <tr>
                        <td style="padding: 7px 0; font-size: 13px; color: #696355; font-weight: 600;">Current Status:</td>
                        <td style="padding: 7px 0; font-size: 13px; color: #B45309; font-weight: 700;">PENDING VERIFICATION</td>
                      </tr>
                      <tr>
                        <td style="padding: 7px 0; font-size: 13px; color: #696355; font-weight: 600;">Requested At:</td>
                        <td style="padding: 7px 0; font-size: 13px; color: #696355;">${new Date().toLocaleString(
                          "en-US",
                          {
                            dateStyle: "full",
                            timeStyle: "short",
                          }
                        )}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 10px 0 25px 0;">
                    <a href="${portalUrl}" target="_blank" style="display: inline-block; background-color: #123818; color: #FFFDF7; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 34px; border-radius: 14px; box-shadow: 0 4px 15px rgba(18, 56, 24, 0.3); border: 1px solid #D6B866;">
                      Review & Verify Request &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #8C8472; text-align: center; line-height: 1.5;">
                Or open the admin portal link directly:<br>
                <a href="${portalUrl}" style="color: #B58A2A; text-decoration: underline; word-break: break-all;">${portalUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #EFE4D2; padding: 20px 30px; text-align: center; border-top: 1px solid #D9C8A8;">
              <p style="margin: 0; font-size: 12px; color: #696355; font-weight: 500;">
                SurahSphere Quran & Tajweed Academy • Admin Notification System
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log(
        `[Email Notification]: ℹ️ SMTP is not configured in .env. Admin verification request for "${userData.email}" was not sent.`
      );
      return { success: false, reason: "SMTP credentials not provided in .env" };
    }

    const mailOptions = {
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to: adminEmail,
      subject: `[SurahSphere] 🔔 New Verification Request: ${userData.name} (${roleName})`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Notification]: ✅ Admin verification request sent successfully to ${adminEmail} (Message ID: ${info.messageId})`
    );
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(
      `[Email Notification]: ❌ Failed to send admin verification request:`,
      error?.message || error
    );
    return { success: false, error: error?.message || error };
  }
};

// Alias for semantic clarity
export const sendVerificationRequestToAdmin = sendNewUserSignupNotificationToAdmin;

/**
 * Sends a "Registration Confirmation & Pending Verification" email to User
 */
export const sendWelcomeEmailToUser = async (userData: INewUserEmailData) => {
  const loginUrl = `${envVars.FRONTEND_URL}/login`;
  const roleName =
    userData.role === "TEACHER"
      ? "Teacher / Instructor"
      : userData.role === "STUDENT"
      ? "Quran Student"
      : userData.role;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8EFE3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #171713;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8EFE3; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFDF7; border-radius: 24px; border: 1px solid #D9C8A8; box-shadow: 0 10px 30px rgba(18, 56, 24, 0.08); overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #123818 0%, #0B2811 100%); padding: 35px 30px; text-align: center; border-bottom: 3px solid #D6B866;">
              <h1 style="margin: 0; color: #FFFDF7; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">SurahSphere</h1>
              <p style="margin: 6px 0 0 0; color: #D6B866; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">Quran & Tajweed Academy</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 35px 30px;">
              <div style="display: inline-block; background-color: #ECFDF5; color: #065F46; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 18px; border: 1px solid #A7F3D0;">
                ✓ Registration Confirmed
              </div>

              <p style="margin: 0 0 10px 0; font-size: 16px; color: #123818; font-weight: 700;">
                Assalamu Alaikum wa Rahmatullahi wa Barakatuh, ${userData.name}!
              </p>

              <p style="margin: 0 0 20px 0; font-size: 14px; color: #4A463B; line-height: 1.6;">
                Thank you for joining <strong>SurahSphere Academy</strong>. We have successfully received your registration details. Your account has been created and is now queued for administrative verification.
              </p>

              <!-- Registration Details Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8EFE3; border-radius: 16px; border: 1px solid #D9C8A8; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #696355; font-weight: 600; width: 140px;">Full Name:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #123818; font-weight: 700;">${userData.name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #696355; font-weight: 600;">Registered Email:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #123818; font-weight: 600;">${userData.email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #696355; font-weight: 600;">Account Role:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #123818; font-weight: 700;">${roleName}</td>
                      </tr>
                      ${
                        userData.rollNumber
                          ? `<tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #696355; font-weight: 600;">Roll / ID:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #123818; font-weight: 600; font-family: monospace;">${userData.rollNumber}</td>
                      </tr>`
                          : ""
                      }
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #696355; font-weight: 600;">Verification Status:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #D97706; font-weight: 700;">Pending Admin Review ⏳</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Steps Card -->
              <div style="background-color: #FFFDF7; border: 1px dashed #C8B99D; border-radius: 14px; padding: 18px 20px; margin-bottom: 26px;">
                <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: 700; color: #123818; text-transform: uppercase; letter-spacing: 0.5px;">What happens next?</p>
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #555043; line-height: 1.5;">
                  <strong>1. Review:</strong> Our administrative team will review your application.
                </p>
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #555043; line-height: 1.5;">
                  <strong>2. Verification:</strong> Once approved, you will receive an email confirmation and instant access to your portal.
                </p>
                <p style="margin: 0; font-size: 13px; color: #555043; line-height: 1.5;">
                  <strong>3. Access:</strong> You can then attend live Quran sessions, track daily progress, and receive teacher feedback.
                </p>
              </div>

              <!-- Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 10px 0 25px 0;">
                    <a href="${loginUrl}" target="_blank" style="display: inline-block; background-color: #123818; color: #FFFDF7; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 34px; border-radius: 14px; box-shadow: 0 4px 15px rgba(18, 56, 24, 0.3); border: 1px solid #D6B866;">
                      Sign In to Account &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #8C8472; text-align: center; line-height: 1.5;">
                Need help or have questions? Simply reply to this email or contact support.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #EFE4D2; padding: 20px 30px; text-align: center; border-top: 1px solid #D9C8A8;">
              <p style="margin: 0; font-size: 12px; color: #696355; font-weight: 500;">
                SurahSphere Quran & Tajweed Academy • Empowering Your Quranic Journey
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log(
        `[Email Notification]: ℹ️ SMTP is not configured in .env. Confirmation email for "${userData.email}" was not sent.`
      );
      return { success: false, reason: "SMTP credentials not provided in .env" };
    }

    const mailOptions = {
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to: userData.email,
      subject: `[SurahSphere] Registration Confirmation: Welcome ${userData.name}!`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Notification]: ✅ Registration confirmation email sent successfully to ${userData.email} (Message ID: ${info.messageId})`
    );
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(
      `[Email Notification]: ❌ Failed to send registration confirmation email to ${userData.email}:`,
      error?.message || error
    );
    return { success: false, error: error?.message || error };
  }
};

// Alias for semantic clarity
export const sendRegistrationConfirmationEmailToUser = sendWelcomeEmailToUser;

/**
 * Sends a notification email to Student when Admin verifies or rejects their profile
 */
export const sendStudentVerificationStatusEmail = async (
  data: IVerificationStatusEmailData
) => {
  const loginUrl = `${envVars.FRONTEND_URL}/login`;
  const isApproved = data.status === "VERIFIED";

  const statusTitle = isApproved ? "Account Verified & Approved! 🎉" : "Verification Update";
  const badgeColor = isApproved ? "#047857" : "#B91C1C";
  const badgeBg = isApproved ? "#ECFDF5" : "#FEF2F2";
  const badgeBorder = isApproved ? "#A7F3D0" : "#FECACA";
  const badgeText = isApproved ? "VERIFIED & ACTIVE" : "APPLICATION REJECTED";

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${statusTitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8EFE3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #171713;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8EFE3; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFDF7; border-radius: 24px; border: 1px solid #D9C8A8; box-shadow: 0 10px 30px rgba(18, 56, 24, 0.08); overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #123818 0%, #0B2811 100%); padding: 35px 30px; text-align: center; border-bottom: 3px solid #D6B866;">
              <h1 style="margin: 0; color: #FFFDF7; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">SurahSphere</h1>
              <p style="margin: 6px 0 0 0; color: #D6B866; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">Quran & Tajweed Academy</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 35px 30px;">
              <div style="display: inline-block; background-color: ${badgeBg}; color: ${badgeColor}; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 18px; border: 1px solid ${badgeBorder};">
                ${badgeText}
              </div>

              <p style="margin: 0 0 10px 0; font-size: 16px; color: #123818; font-weight: 700;">
                Assalamu Alaikum ${data.name},
              </p>

              ${
                isApproved
                  ? `
              <h2 style="margin: 0 0 16px 0; color: #123818; font-size: 20px; font-weight: 700; line-height: 1.4;">
                Mabrook! Your account has been verified by the administrator.
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #4A463B; line-height: 1.6;">
                You now have full access to SurahSphere Academy. You can sign in to view your Quran learning dashboard, schedule classes, track daily progress, and connect with your teachers.
              </p>
              `
                  : `
              <h2 style="margin: 0 0 16px 0; color: #991B1B; font-size: 20px; font-weight: 700; line-height: 1.4;">
                Your account verification could not be approved at this time.
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #4A463B; line-height: 1.6;">
                Our administration team was unable to verify your profile for the following reason:
              </p>
              <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; color: #991B1B; font-weight: 600;">
                  ${data.rejectionReason || "Verification criteria not met. Please contact support."}
                </p>
              </div>
              `
              }

              <!-- Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 10px 0 25px 0;">
                    <a href="${loginUrl}" target="_blank" style="display: inline-block; background-color: #123818; color: #FFFDF7; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 34px; border-radius: 14px; box-shadow: 0 4px 15px rgba(18, 56, 24, 0.3); border: 1px solid #D6B866;">
                      ${isApproved ? "Sign In to Your Dashboard &rarr;" : "Visit SurahSphere Portal &rarr;"}
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #8C8472; text-align: center; line-height: 1.5;">
                If you have questions about this update, please reply directly to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #EFE4D2; padding: 20px 30px; text-align: center; border-top: 1px solid #D9C8A8;">
              <p style="margin: 0; font-size: 12px; color: #696355; font-weight: 500;">
                SurahSphere Quran & Tajweed Academy • Empowering Your Quranic Journey
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log(
        `[Email Notification]: ℹ️ SMTP is not configured in .env. Verification update email for "${data.email}" was not sent.`
      );
      return { success: false, reason: "SMTP credentials not provided in .env" };
    }

    const mailOptions = {
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to: data.email,
      subject: `[SurahSphere] Account Verification Status: ${data.status === "VERIFIED" ? "Approved ✅" : "Notice ℹ️"}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Notification]: ✅ Verification status (${data.status}) email sent successfully to ${data.email} (Message ID: ${info.messageId})`
    );
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(
      `[Email Notification]: ❌ Failed to send verification status email to ${data.email}:`,
      error?.message || error
    );
    return { success: false, error: error?.message || error };
  }
};

/**
 * Sends a "3-Day Free Trial Booking" notification email directly to Admin
 */
export const sendFreeTrialNotificationToAdmin = async (
  trialData: IFreeTrialBookingData
) => {
  const adminEmail = envVars.ADMIN.EMAIL;
  const adminName = envVars.ADMIN.NAME;
  const whatsappDigits = trialData.phone ? trialData.phone.replace(/[^0-9+]/g, "") : null;
  const whatsappUrl = whatsappDigits ? `https://wa.me/${whatsappDigits.replace(/^\+/, "")}` : null;
  const mailtoUrl = `mailto:${trialData.email}?subject=SurahSphere%20Free%20Trial%20Booking%20-%20Schedule%20Your%20Class`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New 3-Day Free Trial Booking</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8EFE3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #171713;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8EFE3; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFDF7; border-radius: 20px; border: 1px solid #D9C8A8; overflow: hidden; box-shadow: 0 10px 25px rgba(18, 56, 24, 0.05);">
          
          <!-- Gold & Emerald Header Accent -->
          <tr>
            <td height="8" style="background: linear-gradient(90deg, #B58A2A 0%, #123818 50%, #B58A2A 100%);"></td>
          </tr>

          <!-- Academy Branding Header -->
          <tr>
            <td style="padding: 32px 36px 20px 36px; text-align: center; border-bottom: 1px solid #ECE3D4;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #123818; letter-spacing: -0.5px;">
                SURAH<span style="color: #B58A2A;">SPHERE</span>
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2.5px; color: #696355; font-weight: 600;">
                Online Quran Academy
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <div style="display: inline-block; padding: 6px 14px; background-color: #E8F5E9; border: 1px solid #C8E6C9; border-radius: 30px; font-size: 12px; font-weight: 700; color: #123818; margin-bottom: 16px;">
                ⭐ NEW 3-DAY FREE TRIAL BOOKING
              </div>

              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #123818;">
                Assalamu Alaikum ${adminName},
              </h2>

              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #4B463C;">
                A student has just submitted a booking request for a <strong>3-Day Free Quran Trial Session</strong> via the website homepage. Here are the booking details:
              </p>

              <!-- Booking Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF4EB; border-radius: 14px; border: 1px solid #E4D7C2; margin-bottom: 24px; padding: 18px 20px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #696355; width: 140px; font-weight: 600;">Full Name:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #123818; font-weight: 700;">${trialData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #696355; font-weight: 600;">Email Address:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #123818; font-weight: 600;">
                    <a href="mailto:${trialData.email}" style="color: #123818; text-decoration: underline;">${trialData.email}</a>
                  </td>
                </tr>
                ${
                  trialData.phone
                    ? `
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #696355; font-weight: 600;">Phone / WhatsApp:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #123818; font-weight: 600;">
                    ${trialData.phone}
                    ${whatsappUrl ? `<a href="${whatsappUrl}" style="margin-left: 8px; font-size: 12px; color: #047857; text-decoration: none; font-weight: bold;">(Open WhatsApp 💬)</a>` : ""}
                  </td>
                </tr>
                `
                    : ""
                }
                ${
                  trialData.course
                    ? `
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #696355; font-weight: 600;">Interested Course:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #B58A2A; font-weight: 700;">${trialData.course}</td>
                </tr>
                `
                    : ""
                }
                ${
                  trialData.ageGroup
                    ? `
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #696355; font-weight: 600;">Student Age Group:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #123818; font-weight: 600;">${trialData.ageGroup}</td>
                </tr>
                `
                    : ""
                }
                ${
                  trialData.preferredTime
                    ? `
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #696355; font-weight: 600;">Preferred Timing:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #123818; font-weight: 600;">${trialData.preferredTime}</td>
                </tr>
                `
                    : ""
                }
                ${
                  trialData.message
                    ? `
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #696355; font-weight: 600; vertical-align: top;">Notes / Message:</td>
                  <td style="padding: 8px 0; font-size: 13px; color: #4B463C; line-height: 1.5; font-style: italic;">"${trialData.message}"</td>
                </tr>
                `
                    : ""
                }
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #696355; font-weight: 600;">Submitted At:</td>
                  <td style="padding: 8px 0; font-size: 12px; color: #8C681C; font-weight: 500;">${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</td>
                </tr>
              </table>

              <!-- Call to Action Buttons -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 12px; margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${mailtoUrl}" style="display: inline-block; background-color: #123818; color: #FFFDF7; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 12px; margin: 4px; border: 1px solid #B58A2A;">
                      📧 Reply via Email
                    </a>
                    ${
                      whatsappUrl
                        ? `
                    <a href="${whatsappUrl}" style="display: inline-block; background-color: #25D366; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 12px; margin: 4px;">
                      💬 Chat on WhatsApp
                    </a>
                    `
                        : ""
                    }
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #817A6C; text-align: center;">
                Prompt follow-ups increase student trial-to-enrollment conversions by over 80%.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #FAF4EB; border-top: 1px solid #ECE3D4; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #817A6C;">
                © ${new Date().getFullYear()} SurahSphere Academy. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log(
        `[Email Notification]: ℹ️ SMTP is not configured in .env. 3-Day Free Trial booking for "${trialData.email}" was not sent to Admin.`
      );
      return { success: false, reason: "SMTP credentials not provided in .env" };
    }

    const mailOptions = {
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to: adminEmail,
      subject: `[SurahSphere] 🌟 New 3-Day Free Trial Booking: ${trialData.name}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Notification]: ✅ 3-Day Free Trial booking sent successfully to Admin (${adminEmail}) (Message ID: ${info.messageId})`
    );
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(
      `[Email Notification]: ❌ Failed to send free trial notification to admin:`,
      error?.message || error
    );
    return { success: false, error: error?.message || error };
  }
};

/**
 * Sends a confirmation email to the student acknowledging their 3-day free trial request
 */
export const sendFreeTrialConfirmationToStudent = async (
  trialData: IFreeTrialBookingData
) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3-Day Free Trial Booking Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8EFE3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #171713;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8EFE3; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFDF7; border-radius: 20px; border: 1px solid #D9C8A8; overflow: hidden; box-shadow: 0 10px 25px rgba(18, 56, 24, 0.05);">
          
          <!-- Gold & Emerald Header Accent -->
          <tr>
            <td height="8" style="background: linear-gradient(90deg, #B58A2A 0%, #123818 50%, #B58A2A 100%);"></td>
          </tr>

          <!-- Academy Header -->
          <tr>
            <td style="padding: 32px 36px 20px 36px; text-align: center; border-bottom: 1px solid #ECE3D4;">
              <p style="margin: 0 0 6px 0; font-size: 18px; color: #B58A2A; font-family: 'Amiri', serif;">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #123818; letter-spacing: -0.5px;">
                SURAH<span style="color: #B58A2A;">SPHERE</span>
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2.5px; color: #696355; font-weight: 600;">
                Online Quran Academy
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <div style="display: inline-block; padding: 6px 14px; background-color: #E8F5E9; border: 1px solid #C8E6C9; border-radius: 30px; font-size: 12px; font-weight: 700; color: #123818; margin-bottom: 16px;">
                ✨ TRIAL REGISTRATION RECEIVED
              </div>

              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #123818;">
                Assalamu Alaikum ${trialData.name},
              </h2>

              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #4B463C;">
                Alhamdulillah! We have successfully received your request for a <strong>3-Day Free Quran Trial</strong> at SurahSphere Academy.
              </p>

              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #4B463C;">
                One of our academic coordinators will review your preferences and contact you within <strong>24 hours</strong> (via WhatsApp or Email) to confirm your certified tutor and schedule your first 1-on-1 evaluation class.
              </p>

              <!-- Highlights Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF4EB; border-radius: 14px; border: 1px solid #E4D7C2; margin-bottom: 24px; padding: 18px 20px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #123818; font-weight: 600;">
                    ✓ 3 Full Days of 1-on-1 Personalized Lessons
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #123818; font-weight: 600;">
                    ✓ Hand-picked Certified Quran Scholars & Tutors
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #123818; font-weight: 600;">
                    ✓ 100% Free — No Credit Card Required
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #123818; font-weight: 600;">
                    ✓ Flexible Timing to Suit Your Daily Schedule
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.6; color: #4B463C;">
                If you have any urgent questions, feel free to reply directly to this email or reach out to us at <a href="mailto:${envVars.ADMIN.EMAIL}" style="color: #123818; font-weight: 700; text-decoration: underline;">${envVars.ADMIN.EMAIL}</a>.
              </p>

              <p style="margin: 16px 0 0 0; font-size: 14px; font-weight: 700; color: #123818;">
                Barakallahu Feekum,<br>
                <span style="font-weight: 500; font-size: 13px; color: #8C681C;">SurahSphere Academic Admissions Team</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #FAF4EB; border-top: 1px solid #ECE3D4; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #817A6C;">
                © ${new Date().getFullYear()} SurahSphere Academy. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  try {
    const transporter = createTransporter();
    if (!transporter) return { success: false, reason: "SMTP not configured" };

    const mailOptions = {
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to: trialData.email,
      subject: `[SurahSphere] 📖 Your 3-Day Free Quran Trial Booking Confirmed!`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Notification]: ✅ Free trial confirmation sent to student ${trialData.email} (Message ID: ${info.messageId})`
    );
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(
      `[Email Notification]: ❌ Failed to send trial confirmation to student:`,
      error?.message || error
    );
    return { success: false, error: error?.message || error };
  }
};

