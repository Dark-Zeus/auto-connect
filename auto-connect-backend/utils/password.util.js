import bcryptjs from "bcryptjs";
import crypto from "crypto";

/**
 * Validate user password against hashed password
 * @param {Object} user - User object with plain password
 * @param {Object} dbUser - Database user object with hashed password
 * @returns {Promise<boolean>} - Returns true if passwords match
 */
export const validateUser = async (user, dbUser) => {
  try {
    return await bcryptjs.compare(user.password, dbUser.password);
  } catch (error) {
    throw new Error("Password validation failed");
  }
};

/**
 * Hash password with bcrypt
 * @param {string} password - Plain text password
 * @param {number} saltRounds - Number of salt rounds (default: 12)
 * @returns {Promise<string>} - Returns hashed password
 */
export const hashPassword = async (password, saltRounds = 12) => {
  try {
    return await bcryptjs.hash(password, saltRounds);
  } catch (error) {
    throw new Error("Password hashing failed");
  }
};

/**
 * Generate a random password
 * @param {number} length - Length of the password (default: 12)
 * @returns {string} - Generated password
 */
export const generateRandomPassword = (length = 12) => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_@!$";
  let password = "";

  // Ensure at least one character from each required type
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "_@!$";

  // Add one character from each required type
  password += upperCase[Math.floor(Math.random() * upperCase.length)];
  password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Shuffle the password to randomize the order
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

/**
 * Generate a secure random token
 * @param {number} length - Length of the token in bytes (default: 32)
 * @returns {string} - Generated token
 */
export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with strength score and requirements
 */
export const validatePasswordStrength = (password) => {
  const result = {
    isValid: false,
    score: 0,
    requirements: {
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
      noCommonPatterns: false,
    },
    feedback: [],
  };

  if (!password) {
    result.feedback.push("Password is required");
    return result;
  }

  // Check minimum length
  if (password.length >= 8) {
    result.requirements.minLength = true;
    result.score += 1;
  } else {
    result.feedback.push("Password must be at least 8 characters long");
  }

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    result.requirements.hasUpperCase = true;
    result.score += 1;
  } else {
    result.feedback.push("Password must contain at least one uppercase letter");
  }

  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    result.requirements.hasLowerCase = true;
    result.score += 1;
  } else {
    result.feedback.push("Password must contain at least one lowercase letter");
  }

  // Check for numbers
  if (/\d/.test(password)) {
    result.requirements.hasNumber = true;
    result.score += 1;
  } else {
    result.feedback.push("Password must contain at least one number");
  }

  // Check for special characters
  if (/[@$!%*?&_]/.test(password)) {
    result.requirements.hasSpecialChar = true;
    result.score += 1;
  } else {
    result.feedback.push(
      "Password must contain at least one special character (@$!%*?&_)"
    );
  }

  // Check for common patterns
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i,
  ];

  const hasCommonPattern = commonPatterns.some((pattern) =>
    pattern.test(password)
  );
  if (!hasCommonPattern) {
    result.requirements.noCommonPatterns = true;
    result.score += 1;
  } else {
    result.feedback.push("Password contains common patterns");
  }

  // Additional checks for stronger passwords
  if (password.length >= 12) {
    result.score += 1;
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
    result.score += 1;
  }

  // Password is valid if all basic requirements are met
  result.isValid = Object.values(result.requirements).every(
    (req) => req === true
  );

  return result;
};

/**
 * Generate password reset token with expiration
 * @returns {Object} - Token and expiration date
 */
export const generatePasswordResetToken = () => {
  const token = generateSecureToken(32);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  return {
    token,
    expires,
  };
};

/**
 * Generate email verification token
 * @returns {Object} - Token and expiration date
 */
export const generateEmailVerificationToken = () => {
  const token = generateSecureToken(32);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  return {
    token,
    expires,
  };
};

/**
 * Check if a token has expired
 * @param {Date} expirationDate - Token expiration date
 * @returns {boolean} - True if token has expired
 */
export const isTokenExpired = (expirationDate) => {
  return new Date() > new Date(expirationDate);
};

/**
 * Generate a temporary password for new users
 * @returns {string} - Temporary password
 */
export const generateTempPassword = () => {
  return generateRandomPassword(10);
};

/**
 * Sanitize password for logging (never log actual passwords)
 * @param {string} password - Password to sanitize
 * @returns {string} - Sanitized password info
 */
export const sanitizePasswordForLog = (password) => {
  if (!password) return "null";
  return `${password.length} characters`;
};
