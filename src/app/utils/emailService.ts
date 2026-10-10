import nodemailer from "nodemailer";
import { envVars } from "../../config/env";

export interface INewUserEmailData {
  name: string;
  email: string;
  role: string;
  rollNumber?: string | null;
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
  });
};

export const sendNewUserSignupNotificationToAdmin = async (
  userData: INewUserEmailData
) => {
  const adminEmail = envVars.ADMIN.EMAIL;
  const adminName = envVars.ADMIN.NAME;
  const portalUrl = `${envVars.FRONTEND_URL}/portal/admin`;

  const roleBadgeColor = userData.role === "TEACHER" ? "#047857" : "#1D4ED8";
  const roleName =
    userData.role === "TEACHER"
      ? "Instructor / Teacher"
      : userData.role === "STUDENT"
      ? "Quran Student"
      : userData.role;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New User Registration</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8EFE3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #171713;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8EFE3; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" max-width="600" style="max-width: 600px; background-color: #FFFDF7; border-radius: 24px; border: 1px solid #D9C8A8; box-shadow: 0 10px 30px rgba(18, 56, 24, 0.08); overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #123818 0%, #0B2811 100%); padding: 35px 30px; text-align: center; border-bottom: 3px solid #D6B866;">
              <h1 style="margin: 0; color: #FFFDF7; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">SurahSphere</h1>
              <p style="margin: 6px 0 0 0; color: #D6B866; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">Quran Academy Administration</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 35px 30px;">
              <p style="margin: 0 0 12px 0; font-size: 15px; color: #696355; font-weight: 600;">
                Assalamu Alaikum <strong>${adminName}</strong>,
              </p>

              <h2 style="margin: 0 0 16px 0; color: #123818; font-size: 20px; font-weight: 700; line-height: 1.4;">
                A new user just signed up and is awaiting your verification!
              </h2>

              <p style="margin: 0 0 24px 0; font-size: 14px; color: #4A463B; line-height: 1.6;">
                A new member has registered an account on SurahSphere. Please review their registration details and verify their profile in the administrative portal.
              </p>

              <!-- User Details Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8EFE3; border-radius: 16px; border: 1px solid #D9C8A8; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #696355; font-weight: 600; width: 140px;">Full Name:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #123818; font-weight: 700;">${userData.name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #696355; font-weight: 600;">Email Address:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #123818; font-weight: 600;">${userData.email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #696355; font-weight: 600;">Account Type:</td>
                        <td style="padding: 6px 0;">
                          <span style="display: inline-block; background-color: ${roleBadgeColor}; color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${roleName}
                          </span>
                        </td>
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
                        <td style="padding: 6px 0; font-size: 13px; color: #696355; font-weight: 600;">Registered At:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #696355;">${new Date().toLocaleString(
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
                    <a href="${portalUrl}" target="_blank" style="display: inline-block; background-color: #123818; color: #FFFDF7; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 14px; box-shadow: 0 4px 15px rgba(18, 56, 24, 0.3); border: 1px solid #D6B866;">
                      Verify User in Admin Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #8C8472; text-align: center; line-height: 1.5;">
                Or copy and paste this link into your browser:<br>
                <a href="${portalUrl}" style="color: #B58A2A; text-decoration: underline; word-break: break-all;">${portalUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #EFE4D2; padding: 20px 30px; text-align: center; border-top: 1px solid #D9C8A8;">
              <p style="margin: 0; font-size: 12px; color: #696355; font-weight: 500;">
                SurahSphere Quran & Tajweed Academy • Automated Admin Notification
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
        `[Email Notification]: ℹ️ SMTP is not configured in .env (SMTP_USER/SMTP_PASS missing). New user notification for "${userData.email}" (${userData.role}) was logged to console.`
      );
      return { success: false, reason: "SMTP credentials not provided in .env" };
    }

    const mailOptions = {
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to: adminEmail,
      subject: `[SurahSphere] New User Registration: ${userData.name} (${userData.role})`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Notification]: ✅ Admin notification email sent successfully to ${adminEmail} (Message ID: ${info.messageId})`
    );
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(
      `[Email Notification]: ❌ Failed to send admin notification email:`,
      error?.message || error
    );
    return { success: false, error: error?.message || error };
  }
};
