import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/q/health", async (req, res) => {
    const dbStatus = mongoose.connection.readyState;

    const healthStatus = {
        server : {
            status: "UP",
        },
        database : {
            status: "UNKNOWN",
        }
    }
    try {
        const dbState = mongoose.connection.readyState;
        const stateMapping = {
            0: "DOWN",
            1: "UP",
            2: "CONNECTING",
            3: "DISCONNECTING",
        };
        healthStatus.database.status = stateMapping[dbState] || "UNKNOWN";

        if (dbState === 1) {
            await mongoose.connection.db?.command({ ping: 1 });
        }
    } catch (err) {
        healthStatus.database.status = `Error: ${err.message}`;
    }

    res.status(200).json(healthStatus);
});

export default router;