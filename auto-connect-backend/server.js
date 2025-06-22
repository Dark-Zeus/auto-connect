import express from "express";
import dotenv from "dotenv"
dotenv.config();
import cors from "cors";

import LOG from "./configs/log.config.js";

/*** Configs ***/

/* Database Connection */
import connectToDatabase from "./configs/db.config.js";
connectToDatabase();

/* Default Records */
import addDefaultRecords from "./configs/defaultRecords.config.js";
addDefaultRecords();

/* App Config */
const app = express();
app.listen(process.env.AUTO_CONNECT_PORT || 3000, () =>
    LOG.info(`Server running on port : ${process.env.AUTO_CONNECT_PORT || 3000}`)
);

app.use(
    cors({
        origin: `${process.env.AUTO_CONNECT_FRONTEND_URL || "http://localhost:3001"}`,
        methods: "GET, POST, PUT, DELETE, PATCH",
        credentials: true,
    })
);

app.use(express.json());

/*** Routes ***/
import apiV1 from "./routes/api.v1.route.js";

app.use("/api/v1", apiV1);

app.use("/", (req, res) => {
    //return html page with the api documentation in doc folder
    res.sendFile(__dirname + "/docs/index.html");
});