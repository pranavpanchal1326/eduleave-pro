import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import session from "express-session";
import connectDB from "./config/db";
import { initializeSocket } from "./config/socket";
import passport from "./config/passport";

// Routes
import authRoutes from "./routes/auth";
import leaveRoutes from "./routes/leave";
import notificationRoutes from "./routes/notification";
import policyRoutes from "./routes/policy";
import analyticsRoutes from "./routes/analytics";

import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.JWT_SECRET || "session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "✅ EduLeave Pro API Running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/policy", policyRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error Handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`🌐 CORS: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`\n✨ All systems ready!\n`);
});
