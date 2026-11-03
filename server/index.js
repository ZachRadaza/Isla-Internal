import "dotenv/config";
import express from "express";
import mainRouter from "./routes/routes.js";
import { connectToMongoDB, disconnectFromMongoDB } from "./db/mongo.js";

const app = express();
const PORT = process.env.PORT || 3000;

await connectToMongoDB();

// Middleware
app.use(express.json());

// routing
app.use("/api", mainRouter);

// error handling
app.use((error, req, res, next) => {
    console.error(error);

    res.status(500).json({
        error: "Internal server error"
    });
});

//start server
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


//ending server
async function shutdown(signal) {
    console.log(`${signal} received. Shutting down...`);

    server.close(async () => {
        await disconnectFromMongoDB();
        console.log("Shutdown complete");
        process.exit(0);
    });
}

process.on("SIGINT", () => shutdown("SIGINT"));   // Ctrl+C
process.on("SIGTERM", () => shutdown("SIGTERM")); // Deployment shutdown