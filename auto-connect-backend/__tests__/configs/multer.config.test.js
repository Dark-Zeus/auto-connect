import express from "express";
import request from "supertest";
import { upload } from "../../configs/multer.config.js"; // Adjust the import path as necessary

describe("Multer File Upload", () => {
    let app;

    beforeAll(() => {
        app = express();
        app.post(
            "/upload",
            upload.single("image"),
            (req, res) => {
                res.status(200).send("File uploaded successfully");
            },
            (error, req, res, next) => {
                res.status(400).send(error.message);
            }
        );
    });

    test("should upload an image file successfully", async () => {
        const validImageBuffer = Buffer.from([137,80,78,71,13,10,26,10]);

        const response = await request(app)
            .post("/upload")
            .attach("image", validImageBuffer, { filename: "test.png" })
            .expect(200);

        expect(response.text).toBe("File uploaded successfully");
    });

    test("should return error if the file is not an image", async () => {
        const textBuffer = Buffer.from("This is not an image file");

        const response = await request(app)
            .post("/upload")
            .attach("image", textBuffer, { filename: "test.txt" })
            .expect(400);

        expect(response.text).toMatch(/Only image files are allowed!/);
    });

    test("should return error if the file size exceeds the limit", async () => {
        const largeFileBuffer = Buffer.alloc(11 * 1024 * 1024);

        const response = await request(app)
            .post("/upload")
            .attach("image", largeFileBuffer, { filename: "large-image.jpg" })
            .expect(400);

        expect(response.text).toMatch(/File too large/);
    });
});
