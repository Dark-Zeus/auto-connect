const bcrypt = require('bcrypt');
const { validateUser, generateRandomPassword } = require('../../utils/password.util'); // update path

jest.mock('bcrypt');

describe('User Utility Functions', () => {
    describe('validateUser', () => {
        it('should return true when passwords match', async () => {
            const user = { password: 'password123' };
            const dbUser = { password: 'hashedpassword123' };

            // Mock bcrypt.compare to resolve true
            bcrypt.compare.mockResolvedValue(true);

            const result = await validateUser(user, dbUser);

            expect(bcrypt.compare).toHaveBeenCalledWith(user.password, dbUser.password);
            expect(result).toBe(true);
        });

        it('should return false when passwords do not match', async () => {
            const user = { password: 'wrongpassword' };
            const dbUser = { password: 'hashedpassword123' };

            // Mock bcrypt.compare to resolve false
            bcrypt.compare.mockResolvedValue(false);

            const result = await validateUser(user, dbUser);

            expect(bcrypt.compare).toHaveBeenCalledWith(user.password, dbUser.password);
            expect(result).toBe(false);
        });
    });

    describe('generateRandomPassword', () => {
        it('should generate a password of the correct length', () => {
            const length = 8;
            const password = generateRandomPassword(length);
            expect(password).toHaveLength(length);
        });

        it('should only contain valid characters', () => {
            const length = 20;
            const validChars = /^[A-Za-z0-9_@!$]+$/;

            const password = generateRandomPassword(length);
            expect(password).toMatch(validChars);
        });

        it('should generate different passwords on each call (likely)', () => {
            const pwd1 = generateRandomPassword(8);
            const pwd2 = generateRandomPassword(8);
            // They *could* be the same by chance, but extremely unlikely
            expect(pwd1).not.toBe(pwd2);
        });
    });
});
