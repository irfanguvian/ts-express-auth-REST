import express from "express";
import config from "config";
import connectDb from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import { deserializeUser } from "./middleware/deserializeUser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(deserializeUser);
const port = config.get<Number>("port");
app.listen(port, async () => {
	logger.info(`app is running at http://localhost:${port}`);
	await connectDb();

	routes(app);
});
