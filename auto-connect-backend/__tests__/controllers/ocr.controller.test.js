const ocrController = require('../../controllers/ocr.controller');
const ocrService = require('../../services/ocr.service');
const openAi = require('../../utils/openai.util');

jest.mock('../../services/ocr.service');
jest.mock('../../utils/openai.util');

describe('ocrController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            file: {
                buffer: Buffer.from('dummy image content'),
                originalname: 'test.jpg'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
    });

    test('should process bill successfully', async () => {
        const mockOcrData = ['Sample text'];
        const mockParsedBill = { issuer: 'Test Co.', total: 100 };

        ocrService.scanImage.mockResolvedValue(mockOcrData);
        openAi.parseUsingLLM.mockResolvedValue(mockParsedBill);

        await ocrController(req, res);

        expect(ocrService.scanImage).toHaveBeenCalledWith(req.file.buffer);
        expect(openAi.parseUsingLLM).toHaveBeenCalledWith(mockOcrData, expect.any(String));
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {
                ocr: mockOcrData,
                llm: mockParsedBill
            },
            fileName: 'test.jpg'
        });
    });

    test('should return 400 if no file is uploaded', async () => {
        req.file = null;

        await ocrController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'No file uploaded' });
    });

    test('should return 400 if no text is extracted', async () => {
        ocrService.scanImage.mockResolvedValue(null);

        await ocrController(req, res);

        expect(ocrService.scanImage).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'No text extracted' });
    });

    test('should handle unexpected errors', async () => {
        const error = new Error('Something went wrong');
        ocrService.scanImage.mockRejectedValue(error);

        await ocrController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Failed to process bill',
            details: error.message
        });
    });
});
