import app, { port } from "./app";
const bootstrap = async () => {
    try {
        const serverPort = port || process.env.PORT || 5000;
        app.listen(serverPort, () => {
            console.log(`Server is running on http://localhost:${serverPort}`);
        });
    }
    catch (error) {
        console.error("Error starting the server:", error);
    }
};
bootstrap();
