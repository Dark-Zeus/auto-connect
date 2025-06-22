const nodemailer = require('nodemailer');
const { send } = require(`../../utils/email.util`);

jest.mock('nodemailer');
const mockSendMail = jest.fn();

// Mock your smtp object (from ../configs/email.config)
jest.mock(`../../configs/email.config`, () => ({
    sendMail: (...args) => mockSendMail(...args),
}));

describe('Email Service', () => {
    beforeEach(() => {
        mockSendMail.mockClear();
    });

    it('should send an email with correct parameters', async () => {
        // Arrange
        const receivers = ['test1@example.com', 'test2@example.com'];
        const subject = 'Test Subject';
        const html = '<p>Test Email</p>';
        const text = 'Test Email';

        const fakeResponse = { messageId: '12345', response: 'OK' };
        mockSendMail.mockResolvedValue(fakeResponse);

        // Act
        const result = await send(receivers, subject, html, text);

        // Assert
        expect(mockSendMail).toHaveBeenCalledTimes(1);
        expect(mockSendMail).toHaveBeenCalledWith({
            from: `${process.env.SMTP_USER} <${process.env.SMTP_EMAIL}>`,
            to: receivers.join(', '),
            subject,
            text,
            html,
        });
        expect(result).toEqual(fakeResponse);
    });

    it('should handle errors gracefully', async () => {
        const receivers = ['fail@example.com'];
        const subject = 'Fail Test';
        const html = '<p>Fail Email</p>';
        const text = 'Fail Email';

        const error = new Error('Send failed');
        mockSendMail.mockRejectedValue(error);

        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const result = await send(receivers, subject, html, text);

        expect(mockSendMail).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith(error);
        expect(result).toBeUndefined();

        consoleSpy.mockRestore();
    });
});
