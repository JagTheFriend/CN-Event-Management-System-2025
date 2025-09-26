import cors from "cors";
import { config as dotenv } from "dotenv";
import express, {
	type Application,
	type NextFunction,
	type Request,
	type Response,
} from "express";
import { commentRouter } from "./routes/comment";
import { eventRouter } from "./routes/event";
import { userRouter } from "./routes/user";
import { webhookRouter } from "./routes/webhook";

dotenv();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors());

// Use raw body parser for webhook routes to preserve the raw body for signature verification
app.use("/webhook", express.raw({ type: "application/json" }));

// Use webhook routes before JSON parser
app.use("/webhook", webhookRouter);

// Regular JSON parser for other routes
app.use(express.json());

// Public routes (no authentication required)
app.use("/event", eventRouter);

// Protected routes (authentication required) - We'll handle auth in individual routes
app.use("/user", userRouter);
app.use("/comment", commentRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ data: null, message: "Internal Server Error" });
});

app.get("/", (_req: Request, res: Response) => {
	res.send("Hello World");
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
