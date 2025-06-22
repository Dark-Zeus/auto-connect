const express = require('express');
const request = require('supertest');
const multer = require('multer');
const ocrRouter = require('../../routes/ocr.route');

// Mock the controller
jest.mock('../../controllers/ocr.controller', () => jest.fn());

const ocrController = require('../../controllers/ocr.controller');

describe('OCR Route', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/ocr', ocrRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should handle a successful image upload', async () => {
        ocrController.mockImplementation((req, res) => {
            res.status(200).json({ success: true, message: 'OCR processed' });
        });

        const response = await request(app)
            .post('/ocr')
            .attach('billImage', Buffer.from('dummy image content'), {
                filename: 'test.jpg',
                contentType: 'image/jpeg'
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, message: 'OCR processed' });
        expect(ocrController).toHaveBeenCalled();
    });

    test('should return 400 when no file is uploaded', async () => {
        ocrController.mockImplementation((req, res) => {
            res.status(400).json({ error: 'No file uploaded' });
        });

        const response = await request(app)
            .post('/ocr');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'No file uploaded' });
    });

    test('should handle controller error', async () => {
        ocrController.mockImplementation((req, res) => {
            res.status(500).json({ error: 'Internal server error' });
        });

        const response = await request(app)
            .post('/ocr')
            .attach('billImage', Buffer.from('dummy image content'), {
                filename: 'test.jpg',
                contentType: 'image/jpeg'
            });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Internal server error' });
    });
});
