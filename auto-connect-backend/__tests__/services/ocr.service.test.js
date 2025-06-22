const { scanImage } = require('../../services/ocr.service');
const ocr = require('../../utils/azureVision.util');

jest.mock('../../utils/azureVision.util');

describe('scanImage', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should throw error if no file is uploaded', async () => {
        await expect(scanImage(null)).rejects.toThrow('No file uploaded');
    });

    test('should throw error if no text is extracted', async () => {
        ocr.extractText.mockResolvedValue([]);

        await expect(scanImage(Buffer.from('dummy'))).rejects.toThrow('No text extracted');
    });

    test('should return JSON string of lines if text is extracted', async () => {
        const mockLines = ['Item 1', 'Item 2'];
        ocr.extractText.mockResolvedValue(mockLines);

        const result = await scanImage(Buffer.from('dummy'));
        expect(ocr.extractText).toHaveBeenCalledWith(expect.any(Buffer));
        expect(result).toEqual(JSON.stringify(mockLines));
    });
});
