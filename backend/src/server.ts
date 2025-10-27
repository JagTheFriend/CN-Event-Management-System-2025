import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { commentRouter } from "./routes/comment";
import { eventRouter } from "./routes/event";
import { userRouter } from "./routes/user";
import { webhookRouter } from "./routes/webhook";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use("/webhook", express.raw({ type: "application/json" }));

app.use("/webhook", webhookRouter);

app.use(express.json());

app.use("/event", eventRouter);

app.use("/user", userRouter);
app.use("/comment", commentRouter);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ data: null, message: "Internal Server Error" });
});

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
