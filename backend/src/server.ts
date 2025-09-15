import cors from "cors";
import { config as dotenv } from "dotenv";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";

dotenv();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors());

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World");
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
