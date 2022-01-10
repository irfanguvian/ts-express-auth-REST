import express, { Request, Response} from "express";
import config from "config";
import connectDb from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import { deserializeUser } from "./middleware/deserializeUser";
import swaggerDocs from "./utils/swagger";

import { restResponseTimeHistogram, startMetricsServer } from "./utils/metrics";
import responseTime from "response-time";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(deserializeUser);
app.use(responseTime((req : Request, res: Response, time:number)=> {
	if(req?.route?.path) {
		restResponseTimeHistogram.observe({
			method: req.method,
			route: req.route.path,
			status_code: res.statusCode
		}, time / 1000)
	}
}))

const port = config.get<number>("port");
app.listen(port, async () => {
	logger.info(`app is running at http://localhost:${port}`);
	await connectDb();

	routes(app);

	swaggerDocs(app, port);

	startMetricsServer();
});
