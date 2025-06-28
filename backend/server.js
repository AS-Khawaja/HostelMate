import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';

import hostelRoutes from "./routes/hostels.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API
app.use("/api/hostels", hostelRoutes);

// === Production Frontend Serving ===
if (process.env.NODE_ENV === "production") {
	const frontendBuildPath = path.join(__dirname, "..", "frontend", "dist");
	
	// Check if the build directory exists
	if (!fs.existsSync(frontendBuildPath)) {
		console.error("Frontend build directory not found. Please run 'npm run build' first.");
		process.exit(1);
	}
	
	app.use(express.static(frontendBuildPath));
	app.get("*", (req, res) => {
		res.sendFile(path.join(frontendBuildPath, "index.html"));
	});
}

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, async () => {
	try {
		await connectDB();
		console.log("Server started at http://localhost:" + PORT);
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
});
