const axios = require('axios');
const { extractText } = require('../../utils/azureVision.util');

jest.mock('axios');

describe('extractText', () => {
    const dummyBuffer = Buffer.from('fake-image-data');
    const resultUrl = 'https://fake.endpoint/operation-location';

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return lines when OCR succeeds', async () => {
        axios.post.mockResolvedValue({
            headers: { 'operation-location': resultUrl }
        });

        axios.get
            .mockResolvedValueOnce({ data: { status: 'running' } })
            .mockResolvedValueOnce({
                data: {
                    status: 'succeeded',
                    analyzeResult: {
                        readResults: [
                            { lines: [{ text: 'Line 1' }, { text: 'Line 2' }] }
                        ]
                    }
                }
            });

        const lines = await extractText(dummyBuffer);
        expect(lines).toEqual(['Line 1', 'Line 2']);
    });

    test('should throw an error when OCR fails', async () => {
        axios.post.mockResolvedValue({
            headers: { 'operation-location': resultUrl }
        });

        axios.get.mockResolvedValue({
            data: { status: 'failed' }
        });

        await expect(extractText(dummyBuffer))
            .rejects
            .toThrow('OCR processing failed');
    });

    test('should throw an error when OCR times out', async () => {
        axios.post.mockResolvedValue({
            headers: { 'operation-location': resultUrl }
        });

        axios.get.mockResolvedValue({ data: { status: 'running' } });

        await expect(extractText(dummyBuffer))
            .rejects
            .toThrow('OCR processing timed out after multiple attempts');

        expect(axios.get).toHaveBeenCalledTimes(10);
    }, 12000);

    test('should throw if no data in result', async () => {
        axios.post.mockResolvedValue({
            headers: { 'operation-location': resultUrl }
        });

        axios.get.mockResolvedValue({});

        await expect(extractText(dummyBuffer))
            .rejects
            .toThrow('No data found in OCR result');
    });
});
