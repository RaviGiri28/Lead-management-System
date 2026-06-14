import express from "express";
import cors from "cors";
import leadRoutes from "./routes/leadRoutes";
import integrationRoutes from './routes/integrationRoutes';
import analyticsRoutes from "./routes/analyticsRoutes";
import authRoutes from "./routes/authRoutes";
import fcmRoutes from "./routes/fcmRoutes";
import notificationRoutes from './routes/Notification.routes'

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LMS Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api", integrationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/fcm", fcmRoutes);
app.use("/api/notifications", notificationRoutes);
export default app;