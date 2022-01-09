import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

export default async function connect() {
	const dbUri = config.get<string>("dbUri"); // config

	try {
		return await mongoose
			.connect(dbUri)
			.then(() => logger.info("DB Connected"));
	} catch (error) {
		logger.error(error);
		process.exit(1);
	}
}
