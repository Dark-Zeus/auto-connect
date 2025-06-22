jest.mock("pino");
jest.mock("@elastic/ecs-pino-format");

describe("Logger Config", () => {
    afterEach(() => {
        jest.resetModules(); // clear require cache
        jest.clearAllMocks();
    });

    test("should create a pino logger with elastic ecs format", () => {
        const mockPino = jest.fn();
        const mockFormat = jest.fn().mockReturnValue({ ecs: true });

        require("pino").mockImplementation(mockPino);
        require("@elastic/ecs-pino-format").mockImplementation(mockFormat);

        const logger = require("../../configs/log.config"); // adjust path

        expect(mockFormat).toHaveBeenCalled();
        expect(mockPino).toHaveBeenCalledWith({ ecs: true });
    });
});
