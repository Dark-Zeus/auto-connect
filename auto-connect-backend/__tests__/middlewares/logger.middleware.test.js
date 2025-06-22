const logger = require('../../middlewares/logger.middleware'); // update the path
const LOG = require('../../configs/log.config');

jest.mock('../../configs/log.config');

describe('Logger Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            method: 'GET',
            url: '/test',
            originalUrl: '/test',
            ip: '127.0.0.1'
        };

        res = {
            on: jest.fn(),
            statusCode: 200
        };

        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should log incoming request and call next()', () => {
        logger(req, res, next);

        // Check if LOG.info was called for the incoming request
        expect(LOG.info).toHaveBeenCalledWith(
            expect.objectContaining({
                event: 'request',
                method: 'GET',
                url: '/test',
                remoteAddress: '127.0.0.1'
            }),
            'Incoming request'
        );

        expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
        expect(next).toHaveBeenCalled();
    });

    it('should log response on finish', () => {
        logger(req, res, next);

        // Capture the handler passed to res.on
        const finishHandler = res.on.mock.calls[0][1];

        // Simulate the response finishing
        finishHandler();

        // Check if LOG.info was called for the response
        expect(LOG.info).toHaveBeenCalledWith(
            expect.objectContaining({
                event: 'response',
                method: 'GET',
                url: '/test',
                statusCode: 200,
                responseTime: expect.stringMatching(/ms$/)
            }),
            'Request completed'
        );
    });
});
