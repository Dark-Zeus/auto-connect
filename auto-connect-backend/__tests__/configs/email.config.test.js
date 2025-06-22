import nodemailer from "nodemailer";
jest.mock("nodemailer");

describe("SMTP Transport", () => {
    beforeAll(() => {
        process.env.SMTP_HOST = "smtp.test.com";
        process.env.SMTP_PORT = "465";
        process.env.SMTP_EMAIL = "test@test.com";
        process.env.SMTP_KEY = "secret-key";
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("should create a transporter with correct config", () => {
        const mockTransport = {};
        nodemailer.createTransport.mockReturnValue(mockTransport);

        const smtp = require("../../utils/email.util");

        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            host: "smtp.test.com",
            port: "465",
            secure: true,
            auth: {
                user: "test@test.com",
                pass: "secret-key",
            },
        });

        expect(smtp).toHaveProperty('send');
        expect(typeof smtp.send).toBe('function');
    });
});
