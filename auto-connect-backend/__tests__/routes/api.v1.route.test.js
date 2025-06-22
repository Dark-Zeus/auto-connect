const request = require("supertest");
const express = require("express");
const path = require("path");
const fs = require("fs");

jest.mock("../../controllers/ocr.controller");

describe("Routes", () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use("/", require("../../routes/api.v1.route"));
    });

    test("GET /q/health should return 200 and status UP", async () => {
        const res = await request(app).get("/q/health");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("server.status", "UP");
    });

    test("POST /ocr should return 200 for successful file upload", async () => {
        const mockOcrController = require("../../controllers/ocr.controller");
        mockOcrController.mockImplementation((req, res) => {
            res.status(200).json({
                success: true,
                data: {
                    ocr: "Sample OCR text extracted from image",
                    llm: "Parsed bill data"
                }
            });
        });

        const res = await request(app)
            .post("/ocr")
            .set('Content-Type', 'multipart/form-data')
            .attach("billImage", Buffer.from('dummy image content'));

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.ocr).toContain("Sample OCR text extracted from image");
    });

    test("POST /ocr should return 500 for error in processing file", async () => {
        const mockOcrController = require("../../controllers/ocr.controller");
        mockOcrController.mockImplementation((req, res) => {
            res.status(500).json({
                error: "Failed to process bill",
                details: "Some error details"
            });
        });

        const res = await request(app)
            .post("/ocr")
            .set('Content-Type', 'multipart/form-data')
            .attach("billImage", Buffer.from('dummy image content'));

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Failed to process bill");
    });
});

