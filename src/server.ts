import app, { port } from "./app";

const bootstrap = async () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

bootstrap();
