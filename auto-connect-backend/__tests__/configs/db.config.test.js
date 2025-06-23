import { connectToDatabase } from '../../configs/db.config';
import mongoose from 'mongoose';

jest.mock('mongoose');

describe('connectToDatabase', () => {
    let exitSpy;
    let logInfoSpy;
    let logErrorSpy;

    beforeEach(() => {
        // Spy on process.exit to prevent real exit
        exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

        // Spy on the logger
        const LOG = require('../../configs/log.config');
        logInfoSpy = jest.spyOn(LOG, 'info').mockImplementation(() => {});
        logErrorSpy = jest.spyOn(LOG, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should exit if AUTO_CONNECT_DB_URL is not set', async () => {
        delete process.env.AUTO_CONNECT_DB_URL;

        await connectToDatabase(5000);

        expect(logErrorSpy).toHaveBeenCalledWith(expect.stringContaining('AUTO_CONNECT_DB_URL is not set'));
        expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('should connect successfully on the first try', async () => {
        process.env.AUTO_CONNECT_DB_URL = 'mongodb://localhost/testdb';

        mongoose.connect.mockResolvedValueOnce(); // simulate success

        await connectToDatabase(5000);

        expect(mongoose.connect).toHaveBeenCalledWith(
            process.env.AUTO_CONNECT_DB_URL,
            expect.objectContaining({
                serverApi: expect.objectContaining({ version: '1' })
            })
        );
        expect(logInfoSpy).toHaveBeenCalledWith('Connected to Database');
        expect(exitSpy).not.toHaveBeenCalled();
    });

    it('should retry and eventually succeed', async () => {
        process.env.AUTO_CONNECT_DB_URL = 'mongodb://localhost/testdb';

        // Fail twice then succeed
        mongoose.connect
            .mockRejectedValueOnce(new Error('First fail'))
            .mockRejectedValueOnce(new Error('Second fail'))
            .mockResolvedValueOnce();

        const start = Date.now();
        await connectToDatabase(10000); // enough time to retry

        expect(mongoose.connect).toHaveBeenCalledTimes(3);
        expect(logErrorSpy).toHaveBeenCalledWith(expect.any(Error));
        expect(logInfoSpy).toHaveBeenCalledWith('Connected to Database');
        expect(exitSpy).not.toHaveBeenCalled();
    });
});
