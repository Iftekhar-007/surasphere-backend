import app, { port } from "./app";
import { seedAdmin } from "./app/db/seedAdmin";
import { verifySmtpConnection } from "./app/utils/emailService";

const bootstrap = async () => {
  try {
    // Run admin seed check on startup
    await seedAdmin();

    // Verify SMTP connection and credentials on startup
    await verifySmtpConnection();

    const serverPort = port || process.env.PORT || 5000;
    app.listen(serverPort, () => {
      console.log(`Server is running on http://localhost:${serverPort}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

bootstrap();
