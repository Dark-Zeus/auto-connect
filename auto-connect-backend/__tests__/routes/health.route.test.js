const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const healthRoute = require("../../routes/health.route"); // Adjust the path as needed

jest.mock("mongoose", () => ({
    connection: {
        readyState: 1,
        db: {
            command: jest.fn().mockResolvedValue({ ok: 1 }),
        },
    },
}));

describe("Health Route", () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use("/", healthRoute);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return 200 with server and database status", async () => {
        const res = await request(app).get("/q/health");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("server.status", "UP");
        expect(res.body).toHaveProperty("database.status", "UP");

        // Optionally check that db.command was called when db is UP
        expect(mongoose.connection.db.command).toHaveBeenCalledWith({ ping: 1 });
    });

    test("should show database DOWN if mongoose state is 0", async () => {
        // Mock readyState as 0 (disconnected)
        mongoose.connection.readyState = 0;

        const res = await request(app).get("/q/health");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("server.status", "UP");
        expect(res.body).toHaveProperty("database.status", "DOWN");
    });
});
