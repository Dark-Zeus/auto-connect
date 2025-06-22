import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import LOG from './log.config';

async function connectToDatabase(maxTime = 60000) {
    if (!process.env.AUTO_CONNECT_DB_URL) {
        LOG.error("DATABASE_URL is not set in the environment variables. ask the administrator to set it.");
        process.exit(1);
    }

    const startTime = new Date().getTime();
    const clientOptions = {
        serverApi: { version: '1', strict: true, deprecationErrors: true }
    };

    LOG.info("Attempting to connect to the database...");

    while (true) {
        try {
            await mongoose.connect(process.env.AUTO_CONNECT_DB_URL, clientOptions);
            LOG.info("Connected to database");
            break;
        } catch (error) {
            LOG.error(error);
            LOG.error("Database connection failed. Retrying in 2 seconds...");
            if (new Date().getTime() - startTime > maxTime) {
                LOG.error(error);
                LOG.error("Database connection failed after maximum retry time. Exiting..."); 
                process.exit(1);
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    return true;
}

export default connectToDatabase;
