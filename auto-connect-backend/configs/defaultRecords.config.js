import mongoose from "mongoose";
import dotenv from "dotenv";

import LOG from './log.config.js';

dotenv.config();

async function addDefaultRecords() {
    while (!mongoose.connection.readyState) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        LOG.info("Waiting for database connection to add default records..."); 
    }

    const defaultUser = {
        email: "",
        password: ""
    };

    const systemUser = {
        email: "system@tenantpay.com",
        password: "system123"
    };

    const defaultGroup = {
        name: ""
    };
}

export default addDefaultRecords;
