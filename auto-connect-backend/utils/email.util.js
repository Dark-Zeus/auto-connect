import smtp from "../configs/email.config.js";
import LOG from "../configs/log.config.js";

/**
 * Send email using configured SMTP
 * @param {Array<string>} receivers - Array of recipient email addresses
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} text - Plain text content (optional)
 * @returns {Promise<Object>} - Email send result
 */
export const send = async (receivers, subject, html, text = null) => {
  try {
    const mailOptions = {
      from: `${process.env.AUTO_CONNECT_SMTP_USER} <${process.env.AUTO_CONNECT_SMTP_EMAIL}>`,
      to: Array.isArray(receivers) ? receivers.join(", ") : receivers,
      subject,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML if no text provided
      html,
    };

    const result = await smtp.sendMail(mailOptions);

    LOG.info("Email sent successfully", {
      messageId: result.messageId,
      recipients: receivers,
      subject,
      type: "email_sent",
    });

    return result;
  } catch (error) {
    LOG.error("Email sending failed", {
      error: error.message,
      recipients: receivers,
      subject,
      type: "email_error",
    });
    throw error;
  }
};

/**
 * Send welcome email to new user
 * @param {Object} user - User object
 * @param {string} verificationToken - Email verification token
 * @returns {Promise<Object>} - Email send result
 */
export const sendWelcomeEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.AUTO_CONNECT_FRONTEND_URL}/auth/verify-email/${verificationToken}`;

  const subject = "Welcome to AutoConnect - Verify Your Email";

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Welcome to AutoConnect</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #2c5aa0; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .button { 
                    display: inline-block; 
                    padding: 12px 25px; 
                    background-color: #2c5aa0; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    margin: 15px 0;
                }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 15px 0; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to AutoConnect!</h1>
                </div>
                <div class="content">
                    <h2>Hello ${user.firstName} ${user.lastName},</h2>
                    <p>Thank you for registering with AutoConnect, Sri Lanka's premier vehicle lifecycle management platform.</p>
                    
                    <p>Your account has been created with the following details:</p>
                    <ul>
                        <li><strong>Name:</strong> ${user.firstName} ${
    user.lastName
  }</li>
                        <li><strong>Email:</strong> ${user.email}</li>
                        <li><strong>Role:</strong> ${user.role
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}</li>
                        <li><strong>Phone:</strong> ${user.phone}</li>
                    </ul>
                    
                    <p>To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
                    
                    <div style="text-align: center;">
                        <a href="${verificationUrl}" class="button">Verify Email Address</a>
                    </div>
                    
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background-color: #f4f4f4; padding: 10px; font-family: monospace;">
                        ${verificationUrl}
                    </p>
                    
                    <div class="warning">
                        <strong>Important:</strong> This verification link will expire in 24 hours. If you don't verify your email within this time, you'll need to request a new verification email.
                    </div>
                    
                    <p>Once verified, you'll be able to access all AutoConnect features including:</p>
                    <ul>
                        <li>Vehicle registration and history management</li>
                        <li>Service appointment booking</li>
                        <li>Vehicle trading marketplace</li>
                        <li>Insurance claim processing</li>
                    </ul>
                    
                    <p>If you didn't create this account, please ignore this email or contact our support team.</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The AutoConnect Team</p>
                    <p>This is an automated email. Please do not reply to this message.</p>
                    <p>&copy; ${new Date().getFullYear()} AutoConnect. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  return await send([user.email], subject, html);
};

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {string} resetToken - Password reset token
 * @returns {Promise<Object>} - Email send result
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.AUTO_CONNECT_FRONTEND_URL}/auth/reset-password/${resetToken}`;

  const subject = "AutoConnect - Password Reset Request";

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Password Reset - AutoConnect</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .button { 
                    display: inline-block; 
                    padding: 12px 25px; 
                    background-color: #dc3545; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    margin: 15px 0;
                }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .warning { background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; margin: 15px 0; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔒 Password Reset Request</h1>
                </div>
                <div class="content">
                    <h2>Hello ${user.firstName},</h2>
                    <p>We received a request to reset the password for your AutoConnect account.</p>
                    
                    <p><strong>Account Details:</strong></p>
                    <ul>
                        <li><strong>Email:</strong> ${user.email}</li>
                        <li><strong>Request Time:</strong> ${new Date().toLocaleString()}</li>
                    </ul>
                    
                    <p>To reset your password, click the button below:</p>
                    
                    <div style="text-align: center;">
                        <a href="${resetUrl}" class="button">Reset Password</a>
                    </div>
                    
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background-color: #f4f4f4; padding: 10px; font-family: monospace;">
                        ${resetUrl}
                    </p>
                    
                    <div class="warning">
                        <strong>Security Notice:</strong>
                        <ul>
                            <li>This reset link will expire in 24 hours</li>
                            <li>If you didn't request this reset, please ignore this email</li>
                            <li>Your password will remain unchanged until you create a new one</li>
                            <li>For security, consider changing your password if you suspect unauthorized access</li>
                        </ul>
                    </div>
                    
                    <p>If you're having trouble with the reset process or didn't request this change, please contact our support team immediately.</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The AutoConnect Security Team</p>
                    <p>This is an automated security email. Please do not reply to this message.</p>
                    <p>&copy; ${new Date().getFullYear()} AutoConnect. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  return await send([user.email], subject, html);
};

/**
 * Send email verification reminder
 * @param {Object} user - User object
 * @param {string} verificationToken - Email verification token
 * @returns {Promise<Object>} - Email send result
 */
export const sendEmailVerificationReminder = async (
  user,
  verificationToken
) => {
  const verificationUrl = `${process.env.AUTO_CONNECT_FRONTEND_URL}/auth/verify-email/${verificationToken}`;

  const subject = "AutoConnect - Email Verification Reminder";

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Email Verification Reminder - AutoConnect</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #ffc107; color: #212529; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .button { 
                    display: inline-block; 
                    padding: 12px 25px; 
                    background-color: #ffc107; 
                    color: #212529; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    margin: 15px 0;
                    font-weight: bold;
                }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .info { background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 10px; margin: 15px 0; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>⚠️ Email Verification Required</h1>
                </div>
                <div class="content">
                    <h2>Hello ${user.firstName},</h2>
                    <p>We noticed that you haven't verified your email address yet. To fully activate your AutoConnect account and access all features, please verify your email.</p>
                    
                    <div style="text-align: center;">
                        <a href="${verificationUrl}" class="button">Verify Email Now</a>
                    </div>
                    
                    <p>Until you verify your email, you won't be able to:</p>
                    <ul>
                        <li>Access premium features</li>
                        <li>Receive important account notifications</li>
                        <li>Reset your password if needed</li>
                        <li>Participate in the marketplace</li>
                        <li>Book service appointments</li>
                    </ul>
                    
                    <div class="info">
                        <p><strong>Verification Link:</strong></p>
                        <p style="word-break: break-all; font-family: monospace; background-color: #f4f4f4; padding: 5px;">
                            ${verificationUrl}
                        </p>
                        <p><strong>Note:</strong> This link will expire in 24 hours. If it expires, you can request a new verification email from your account settings.</p>
                    </div>
                    
                    <p>If you're having trouble clicking the button, copy and paste the verification link above into your browser's address bar.</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The AutoConnect Team</p>
                    <p>This is an automated reminder. Please do not reply to this message.</p>
                    <p>&copy; ${new Date().getFullYear()} AutoConnect. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  return await send([user.email], subject, html);
};

/**
 * Send password change confirmation email
 * @param {Object} user - User object
 * @param {string} ipAddress - IP address where change was made
 * @returns {Promise<Object>} - Email send result
 */
export const sendPasswordChangeConfirmation = async (
  user,
  ipAddress = "Unknown"
) => {
  const subject = "AutoConnect - Password Changed Successfully";

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Password Changed - AutoConnect</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .info { background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 10px; margin: 15px 0; border-radius: 4px; }
                .warning { background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; margin: 15px 0; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Password Changed Successfully</h1>
                </div>
                <div class="content">
                    <h2>Hello ${user.firstName},</h2>
                    <p>Your AutoConnect account password has been successfully changed.</p>
                    
                    <div class="info">
                        <strong>Change Details:</strong>
                        <ul>
                            <li><strong>Account:</strong> ${user.email}</li>
                            <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
                            <li><strong>IP Address:</strong> ${ipAddress}</li>
                            <li><strong>Browser:</strong> Web Application</li>
                        </ul>
                    </div>
                    
                    <p>If you made this change, no further action is required. Your account is secure.</p>
                    
                    <div class="warning">
                        <p><strong>If you did not make this change:</strong></p>
                        <ol>
                            <li>Your account may have been compromised</li>
                            <li>Contact our support team immediately at support@autoconnect.lk</li>
                            <li>Change your password immediately if you still have access</li>
                            <li>Review your account activity for any unauthorized actions</li>
                        </ol>
                    </div>
                    
                    <p><strong>Security Recommendations:</strong></p>
                    <ul>
                        <li>Use a strong, unique password for your AutoConnect account</li>
                        <li>Never share your login credentials with anyone</li>
                        <li>Log out from shared or public devices</li>
                        <li>Enable email notifications for account changes</li>
                        <li>Regularly review your account activity</li>
                    </ul>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The AutoConnect Security Team</p>
                    <p>This is an automated security notification. Please do not reply to this message.</p>
                    <p>If you need assistance, contact us at support@autoconnect.lk</p>
                    <p>&copy; ${new Date().getFullYear()} AutoConnect. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  return await send([user.email], subject, html);
};

/**
 * Send account locked notification
 * @param {Object} user - User object
 * @param {Date} unlockTime - When the account will be unlocked
 * @param {string} ipAddress - IP address of failed attempts
 * @returns {Promise<Object>} - Email send result
 */
export const sendAccountLockedNotification = async (
  user,
  unlockTime,
  ipAddress = "Unknown"
) => {
  const subject = "AutoConnect - Account Temporarily Locked";

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Account Locked - AutoConnect</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .warning { background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; margin: 15px 0; border-radius: 4px; }
                .info { background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 10px; margin: 15px 0; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔒 Account Temporarily Locked</h1>
                </div>
                <div class="content">
                    <h2>Hello ${user.firstName},</h2>
                    <p>Your AutoConnect account has been temporarily locked due to multiple failed login attempts.</p>
                    
                    <div class="warning">
                        <strong>Lock Details:</strong>
                        <ul>
                            <li><strong>Account:</strong> ${user.email}</li>
                            <li><strong>Lock Time:</strong> ${new Date().toLocaleString()}</li>
                            <li><strong>Unlock Time:</strong> ${unlockTime.toLocaleString()}</li>
                            <li><strong>Duration:</strong> 15 minutes</li>
                            <li><strong>Failed Attempts From:</strong> ${ipAddress}</li>
                        </ul>
                    </div>
                    
                    <p>This is a security measure to protect your account from unauthorized access attempts.</p>
                    
                    <div class="info">
                        <p><strong>What to do next:</strong></p>
                        <ol>
                            <li>Wait until <strong>${unlockTime.toLocaleString()}</strong> to attempt logging in again</li>
                            <li>Ensure you're using the correct email and password</li>
                            <li>If you forgot your password, use the "Forgot Password" option after the unlock time</li>
                            <li>Contact support if you suspect unauthorized access attempts</li>
                        </ol>
                    </div>
                    
                    <p><strong>Security Tips:</strong></p>
                    <ul>
                        <li>Make sure you're visiting the correct AutoConnect website</li>
                        <li>Use a strong, unique password</li>
                        <li>Don't use public Wi-Fi for sensitive account access</li>
                        <li>Contact us immediately if you suspect fraudulent activity</li>
                    </ul>
                    
                    <p>If these failed attempts were not made by you, please contact our security team immediately.</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The AutoConnect Security Team</p>
                    <p>Security Hotline: +94 11 123 4567</p>
                    <p>Email: security@autoconnect.lk</p>
                    <p>&copy; ${new Date().getFullYear()} AutoConnect. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  return await send([user.email], subject, html);
};

/**
 * Send account verification success email
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Email send result
 */
export const sendAccountVerificationSuccess = async (user) => {
  const subject = "AutoConnect - Email Verified Successfully!";

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Email Verified - AutoConnect</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .success { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 10px; margin: 15px 0; border-radius: 4px; }
                .button { 
                    display: inline-block; 
                    padding: 12px 25px; 
                    background-color: #28a745; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    margin: 15px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Email Successfully Verified!</h1>
                </div>
                <div class="content">
                    <h2>Congratulations ${user.firstName}!</h2>
                    <p>Your email address has been successfully verified. Your AutoConnect account is now fully activated!</p>
                    
                    <div class="success">
                        <p><strong>✅ Account Status: </strong>Fully Verified</p>
                        <p><strong>📧 Email: </strong>${user.email}</p>
                        <p><strong>👤 Role: </strong>${user.role
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}</p>
                        <p><strong>📅 Verified: </strong>${new Date().toLocaleString()}</p>
                    </div>
                    
                    <p>You can now access all AutoConnect features:</p>
                    <ul>
                        <li>✅ Register and manage your vehicles</li>
                        <li>✅ Book service appointments</li>
                        <li>✅ Browse the vehicle marketplace</li>
                        <li>✅ Process insurance claims</li>
                        <li>✅ Access premium features</li>
                        <li>✅ Receive important notifications</li>
                    </ul>
                    
                    <div style="text-align: center;">
                        <a href="${
                          process.env.AUTO_CONNECT_FRONTEND_URL
                        }/dashboard" class="button">Go to Dashboard</a>
                    </div>
                    
                    <p>Thank you for choosing AutoConnect as your vehicle lifecycle management partner!</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The AutoConnect Team</p>
                    <p>Need help? Contact us at support@autoconnect.lk</p>
                    <p>&copy; ${new Date().getFullYear()} AutoConnect. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  return await send([user.email], subject, html);
};

/**
 * Send service provider approval email
 * @param {Object} user - User object
 * @param {Object} businessDetails - Business verification details
 * @returns {Promise<Object>} - Email send result
 */
export const sendServiceProviderApproval = async (user, businessDetails) => {
  const subject = "AutoConnect - Service Provider Application Approved!";

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Service Provider Approved - AutoConnect</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #17a2b8; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .success { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 10px; margin: 15px 0; border-radius: 4px; }
                .button { 
                    display: inline-block; 
                    padding: 12px 25px; 
                    background-color: #17a2b8; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    margin: 15px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to AutoConnect Business Network!</h1>
                </div>
                <div class="content">
                    <h2>Congratulations ${user.firstName}!</h2>
                    <p>Your service provider application has been approved! You are now an official AutoConnect business partner.</p>
                    
                    <div class="success">
                        <p><strong>Business Name:</strong> ${
                          businessDetails.businessName
                        }</p>
                        <p><strong>License Number:</strong> ${
                          businessDetails.licenseNumber
                        }</p>
                        <p><strong>Services:</strong> ${businessDetails.services.join(
                          ", "
                        )}</p>
                        <p><strong>Approval Date:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    
                    <p><strong>What's next?</strong></p>
                    <ul>
                        <li>Complete your business profile</li>
                        <li>Set your service rates and availability</li>
                        <li>Start receiving service requests</li>
                        <li>Build your reputation with customer reviews</li>
                    </ul>
                    
                    <div style="text-align: center;">
                        <a href="${
                          process.env.AUTO_CONNECT_FRONTEND_URL
                        }/provider/dashboard" class="button">Access Provider Dashboard</a>
                    </div>
                    
                    <p>Welcome to the AutoConnect family!</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The AutoConnect Business Team</p>
                    <p>Business Support: business@autoconnect.lk</p>
                    <p>&copy; ${new Date().getFullYear()} AutoConnect. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  return await send([user.email], subject, html);
};

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email format is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize email for logging
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email
 */
export const sanitizeEmailForLog = (email) => {
  if (!email) return "null";
  const [local, domain] = email.split("@");
  if (!domain) return "invalid_email";
  return `${local.substring(0, 2)}***@${domain}`;
};

/**
 * Send bulk notification email
 * @param {Array} users - Array of user objects
 * @param {string} subject - Email subject
 * @param {string} message - Email message
 * @param {string} type - Notification type (info, warning, success, error)
 * @returns {Promise<Array>} - Array of email send results
 */
export const sendBulkNotification = async (
  users,
  subject,
  message,
  type = "info"
) => {
  const getTypeStyles = (type) => {
    const styles = {
      info: {
        bg: "#17a2b8",
        border: "#1591a8",
        alertBg: "#d1ecf1",
        alertBorder: "#bee5eb",
      },
      warning: {
        bg: "#ffc107",
        border: "#e0a800",
        alertBg: "#fff3cd",
        alertBorder: "#ffeaa7",
      },
      success: {
        bg: "#28a745",
        border: "#1e7e34",
        alertBg: "#d4edda",
        alertBorder: "#c3e6cb",
      },
      error: {
        bg: "#dc3545",
        border: "#c82333",
        alertBg: "#f8d7da",
        alertBorder: "#f5c6cb",
      },
    };
    return styles[type] || styles.info;
  };

  const typeStyles = getTypeStyles(type);
  const typeIcons = {
    info: "ℹ️",
    warning: "⚠️",
    success: "✅",
    error: "❌",
  };

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${subject}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: ${
                  typeStyles.bg
                }; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .alert { background-color: ${
                  typeStyles.alertBg
                }; border: 1px solid ${
    typeStyles.alertBorder
  }; padding: 15px; margin: 15px 0; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${typeIcons[type]} ${subject}</h1>
                </div>
                <div class="content">
                    <div class="alert">
                        ${message}
                    </div>
                    <p>This is an important notification from the AutoConnect team.</p>
                    <p>If you have any questions, please contact our support team.</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The AutoConnect Team</p>
                    <p>Support: support@autoconnect.lk | Phone: +94 11 123 4567</p>
                    <p>&copy; ${new Date().getFullYear()} AutoConnect. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  const emailPromises = users.map((user) =>
    send([user.email], subject, html).catch((error) => {
      LOG.error("Bulk email failed for user", {
        userId: user._id,
        email: sanitizeEmailForLog(user.email),
        error: error.message,
      });
      return { error: error.message, email: user.email };
    })
  );

  const results = await Promise.allSettled(emailPromises);

  LOG.info("Bulk notification sent", {
    totalUsers: users.length,
    successful: results.filter((r) => r.status === "fulfilled").length,
    failed: results.filter((r) => r.status === "rejected").length,
    subject,
    type,
  });

  return results;
};

/**
 * Send service appointment confirmation email
 * @param {Object} user - User object
 * @param {Object} appointment - Appointment details
 * @param {Object} serviceProvider - Service provider details
 * @returns {Promise<Object>} - Email send result
 */
export const sendAppointmentConfirmation = async (
  user,
  appointment,
  serviceProvider
) => {
  const subject = "AutoConnect - Service Appointment Confirmed";

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Appointment Confirmed - AutoConnect</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .appointment-details { background-color: #e9ecef; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; }
                .provider-info { background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; margin: 15px 0; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📅 Appointment Confirmed</h1>
                </div>
                <div class="content">
                    <h2>Hello ${user.firstName},</h2>
                    <p>Your service appointment has been confirmed! Here are the details:</p>
                    
                    <div class="appointment-details">
                        <h3>Appointment Details</h3>
                        <p><strong>Service Type:</strong> ${
                          appointment.serviceType
                        }</p>
                        <p><strong>Date & Time:</strong> ${new Date(
                          appointment.scheduledDate
                        ).toLocaleString()}</p>
                        <p><strong>Vehicle:</strong> ${
                          appointment.vehicle.make
                        } ${appointment.vehicle.model} (${
    appointment.vehicle.licensePlate
  })</p>
                        <p><strong>Estimated Cost:</strong> LKR ${
                          appointment.estimatedCost?.toLocaleString() || "TBD"
                        }</p>
                        <p><strong>Appointment ID:</strong> ${
                          appointment._id
                        }</p>
                    </div>
                    
                    <div class="provider-info">
                        <h3>Service Provider</h3>
                        <p><strong>Business:</strong> ${
                          serviceProvider.businessName
                        }</p>
                        <p><strong>Contact:</strong> ${
                          serviceProvider.phone
                        }</p>
                        <p><strong>Address:</strong> ${
                          serviceProvider.address.street
                        }, ${serviceProvider.address.city}</p>
                        <p><strong>License:</strong> ${
                          serviceProvider.licenseNumber
                        }</p>
                    </div>
                    
                    <p><strong>What to bring:</strong></p>
                    <ul>
                        <li>Vehicle registration documents</li>
                        <li>Previous service records (if any)</li>
                        <li>Valid ID</li>
                        <li>Payment method</li>
                    </ul>
                    
                    <p><strong>Need to reschedule?</strong> Contact the service provider directly or manage your appointment through your AutoConnect dashboard.</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The AutoConnect Team</p>
                    <p>Manage appointments: <a href="${
                      process.env.AUTO_CONNECT_FRONTEND_URL
                    }/appointments">Dashboard</a></p>
                    <p>&copy; ${new Date().getFullYear()} AutoConnect. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  return await send([user.email], subject, html);
};

/**
 * Send service completion notification
 * @param {Object} user - User object
 * @param {Object} appointment - Completed appointment details
 * @param {Object} serviceProvider - Service provider details
 * @returns {Promise<Object>} - Email send result
 */
export const sendServiceCompletionNotification = async (
  user,
  appointment,
  serviceProvider
) => {
  const subject = "AutoConnect - Service Completed";

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Service Completed - AutoConnect</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #17a2b8; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .service-summary { background-color: #e9ecef; border-left: 4px solid #17a2b8; padding: 15px; margin: 15px 0; }
                .button { 
                    display: inline-block; 
                    padding: 12px 25px; 
                    background-color: #ffc107; 
                    color: #212529; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    margin: 15px 0;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔧 Service Completed</h1>
                </div>
                <div class="content">
                    <h2>Hello ${user.firstName},</h2>
                    <p>Great news! Your vehicle service has been completed successfully.</p>
                    
                    <div class="service-summary">
                        <h3>Service Summary</h3>
                        <p><strong>Service Type:</strong> ${
                          appointment.serviceType
                        }</p>
                        <p><strong>Completed Date:</strong> ${new Date(
                          appointment.completedDate
                        ).toLocaleString()}</p>
                        <p><strong>Vehicle:</strong> ${
                          appointment.vehicle.make
                        } ${appointment.vehicle.model} (${
    appointment.vehicle.licensePlate
  })</p>
                        <p><strong>Total Cost:</strong> LKR ${appointment.actualCost?.toLocaleString()}</p>
                        <p><strong>Service Provider:</strong> ${
                          serviceProvider.businessName
                        }</p>
                        ${
                          appointment.notes
                            ? `<p><strong>Notes:</strong> ${appointment.notes}</p>`
                            : ""
                        }
                    </div>
                    
                    ${
                      appointment.warranty
                        ? `
                    <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 10px; margin: 15px 0; border-radius: 4px;">
                        <p><strong>🛡️ Warranty Information:</strong></p>
                        <p>Period: ${appointment.warranty.period}</p>
                        <p>Valid Until: ${new Date(
                          appointment.warranty.validUntil
                        ).toLocaleDateString()}</p>
                    </div>
                    `
                        : ""
                    }
                    
                    <p>Your vehicle history has been updated with this service record.</p>
                    
                    <div style="text-align: center;">
                        <a href="${
                          process.env.AUTO_CONNECT_FRONTEND_URL
                        }/appointments/${
    appointment._id
  }/review" class="button">Leave a Review</a>
                    </div>
                    
                    <p>Thank you for using AutoConnect!</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The AutoConnect Team</p>
                    <p>View service history: <a href="${
                      process.env.AUTO_CONNECT_FRONTEND_URL
                    }/vehicles">Dashboard</a></p>
                    <p>&copy; ${new Date().getFullYear()} AutoConnect. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  return await send([user.email], subject, html);
};

/**
 * Send insurance claim update notification
 * @param {Object} user - User object
 * @param {Object} claim - Insurance claim details
 * @param {string} status - New claim status
 * @param {string} message - Update message
 * @returns {Promise<Object>} - Email send result
 */
export const sendInsuranceClaimUpdate = async (
  user,
  claim,
  status,
  message
) => {
  const subject = `AutoConnect - Insurance Claim ${status
    .replace("_", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())}`;

  const statusColors = {
    submitted: "#17a2b8",
    under_review: "#ffc107",
    approved: "#28a745",
    rejected: "#dc3545",
    completed: "#6f42c1",
  };

  const statusIcons = {
    submitted: "📋",
    under_review: "🔍",
    approved: "✅",
    rejected: "❌",
    completed: "🎉",
  };

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Insurance Claim Update - AutoConnect</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: ${
                  statusColors[status] || "#17a2b8"
                }; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .claim-details { background-color: #e9ecef; border-left: 4px solid ${
                  statusColors[status] || "#17a2b8"
                }; padding: 15px; margin: 15px 0; }
                .status-badge { display: inline-block; padding: 5px 10px; background-color: ${
                  statusColors[status] || "#17a2b8"
                }; color: white; border-radius: 3px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${
                      statusIcons[status] || "📋"
                    } Insurance Claim Update</h1>
                </div>
                <div class="content">
                    <h2>Hello ${user.firstName},</h2>
                    <p>Your insurance claim has been updated.</p>
                    
                    <div class="claim-details">
                        <h3>Claim Details</h3>
                        <p><strong>Claim ID:</strong> ${claim._id}</p>
                        <p><strong>Status:</strong> <span class="status-badge">${status
                          .replace("_", " ")
                          .toUpperCase()}</span></p>
                        <p><strong>Vehicle:</strong> ${claim.vehicle.make} ${
    claim.vehicle.model
  } (${claim.vehicle.licensePlate})</p>
                        <p><strong>Claim Amount:</strong> LKR ${claim.claimAmount?.toLocaleString()}</p>
                        <p><strong>Last Updated:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; margin: 15px 0; border-radius: 4px;">
                        <h4>Update Message:</h4>
                        <p>${message}</p>
                    </div>
                    
                    ${
                      status === "approved"
                        ? `
                    <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 10px; margin: 15px 0; border-radius: 4px;">
                        <p><strong>🎉 Good News!</strong> Your claim has been approved. Repair authorization will be sent separately.</p>
                    </div>
                    `
                        : ""
                    }
                    
                    ${
                      status === "rejected"
                        ? `
                    <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; margin: 15px 0; border-radius: 4px;">
                        <p><strong>❌ Claim Rejected</strong> If you believe this is an error, you can appeal this decision by contacting customer service.</p>
                    </div>
                    `
                        : ""
                    }
                    
                    <p>You can view the full claim details and history in your AutoConnect dashboard.</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The AutoConnect Insurance Team</p>
                    <p>View claim: <a href="${
                      process.env.AUTO_CONNECT_FRONTEND_URL
                    }/insurance/claims/${claim._id}">Dashboard</a></p>
                    <p>Support: insurance@autoconnect.lk | Phone: +94 11 123 4567</p>
                    <p>&copy; ${new Date().getFullYear()} AutoConnect. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  return await send([user.email], subject, html);
};

/**
 * Send system maintenance notification
 * @param {Array} users - Array of user objects
 * @param {Object} maintenanceDetails - Maintenance schedule details
 * @returns {Promise<Array>} - Array of email send results
 */
export const sendMaintenanceNotification = async (
  users,
  maintenanceDetails
) => {
  const subject = "AutoConnect - Scheduled System Maintenance";
  const message = `
        <h3>Scheduled System Maintenance</h3>
        <p><strong>Maintenance Window:</strong> ${new Date(
          maintenanceDetails.startTime
        ).toLocaleString()} - ${new Date(
    maintenanceDetails.endTime
  ).toLocaleString()}</p>
        <p><strong>Expected Duration:</strong> ${
          maintenanceDetails.duration
        }</p>
        <p><strong>Impact:</strong> ${maintenanceDetails.impact}</p>
        <p><strong>Reason:</strong> ${maintenanceDetails.reason}</p>
        
        <p>We apologize for any inconvenience and appreciate your patience as we work to improve your AutoConnect experience.</p>
        
        <p>If you have urgent matters, please contact our support team before the maintenance window begins.</p>
    `;

  return await sendBulkNotification(users, subject, message, "warning");
};

/**
 * Generate email template with custom content
 * @param {string} title - Email title
 * @param {string} content - Email content (HTML)
 * @param {string} headerColor - Header background color
 * @param {string} footerText - Custom footer text
 * @returns {string} - Complete HTML email template
 */
export const generateCustomEmailTemplate = (
  title,
  content,
  headerColor = "#2c5aa0",
  footerText = null
) => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${title}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: ${headerColor}; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; }
                .button { 
                    display: inline-block; 
                    padding: 12px 25px; 
                    background-color: ${headerColor}; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    margin: 15px 0;
                }
                .alert { padding: 10px; margin: 15px 0; border-radius: 4px; }
                .alert-info { background-color: #d1ecf1; border: 1px solid #bee5eb; }
                .alert-warning { background-color: #fff3cd; border: 1px solid #ffeaa7; }
                .alert-success { background-color: #d4edda; border: 1px solid #c3e6cb; }
                .alert-danger { background-color: #f8d7da; border: 1px solid #f5c6cb; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${title}</h1>
                </div>
                <div class="content">
                    ${content}
                </div>
                <div class="footer">
                    ${
                      footerText ||
                      `
                        <p>Best regards,<br>The AutoConnect Team</p>
                        <p>Support: support@autoconnect.lk | Phone: +94 11 123 4567</p>
                        <p>&copy; ${new Date().getFullYear()} AutoConnect. All rights reserved.</p>
                    `
                    }
                </div>
            </div>
        </body>
        </html>
    `;
};
