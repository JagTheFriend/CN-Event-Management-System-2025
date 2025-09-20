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

dotenv();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/event", eventRouter);
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
