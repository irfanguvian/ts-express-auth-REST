import express from "express";
import client from "prom-client";
import logger from "./logger";

const app = express();

export const restResponseTimeHistogram = new client.Histogram({
    name: "rest_response_time_duration_seconds",
    help: "REST API response in seconds",
    labelNames: ['method', 'route', 'status_code']
});

export const databaseresponseTimeHistogram = new client.Histogram({
    name: "db_response_time_duration_seconds",
    help: "Database response in seconds",
    labelNames: ['operation', 'success'],
})

export function startMetricsServer(){

    const collectDefaultMetrics = client.collectDefaultMetrics;

    collectDefaultMetrics();

    app.get("/metrics", async (req, res) => {

        const registerMetrics = await client.register.metrics();

        res.set("Content-Type", client.register.contentType);

        return res.send(registerMetrics)
    })

    app.listen(9100, () => {
        logger.info(`app is running at http://localhost:${9100}`);
    })
}