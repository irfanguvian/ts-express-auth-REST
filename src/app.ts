import express from "express";
import config from "config";
import connectDb from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import { deserializeUser } from "./middleware/deserializeUser";
import swaggerDocs from "./utils/swagger";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(deserializeUser);
const port = config.get<number>("port");
app.listen(port, async () => {
	logger.info(`app is running at http://localhost:${port}`);
	await connectDb();

	routes(app);

	swaggerDocs(app, port);
});
