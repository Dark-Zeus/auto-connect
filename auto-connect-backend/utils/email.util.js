// utils/email.util.js
import nodemailer from "nodemailer";
import LOG from "../configs/log.config.js";

// Create email transporter
const createTransport = () => {
  if (process.env.NODE_ENV === "production") {
    // Production - use a service like SendGrid, Mailgun, etc.
    return nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
  } else {
    // Development - use Ethereal Email or similar
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.ethereal.email",
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
};

// Send email function
export const sendEmail = async (options) => {
  try {
    // 1) Create a transporter
    const transporter = createTransport();

    // 2) Define the email options
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || "AutoConnect"} <${
        process.env.EMAIL_FROM || "noreply@autoconnect.lk"
      }>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    // 3) Actually send the email
    const info = await transporter.sendMail(mailOptions);

    LOG.info({
      message: "Email sent successfully",
      to: options.email,
      subject: options.subject,
      messageId: info.messageId,
      response: info.response,
    });

    return info;
  } catch (error) {
    LOG.error({
      message: "Failed to send email",
      to: options.email,
      subject: options.subject,
      error: error.message,
      stack: error.stack,
    });

    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
  const subject = "Welcome to AutoConnect!";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Welcome to AutoConnect!</h1>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p>Thank you for joining AutoConnect, Sri Lanka's premier vehicle lifecycle management platform.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #007bff; margin-top: 0;">Your Account Details:</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Role:</strong> ${user.role
          .replace("_", " ")
          .toUpperCase()}</p>
        <p><strong>Status:</strong> ${
          user.isVerified ? "Verified" : "Pending Verification"
        }</p>
      </div>
      
      ${getRoleSpecificContent(user.role)}
      
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || "http://localhost:3001"}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Access Your Dashboard
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px; text-align: center;">
        This email was sent from AutoConnect. If you didn't create this account, please ignore this email.
      </p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject,
    html,
    message: `Welcome to AutoConnect! Your account has been created successfully.`,
  });
};

// Get role-specific email content
const getRoleSpecificContent = (role) => {
  const content = {
    vehicle_owner: `
      <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="color: #28a745; margin-top: 0;">As a Vehicle Owner, you can:</h4>
        <ul>
          <li>Register and manage your vehicles</li>
          <li>Track maintenance history and schedules</li>
          <li>Book services with verified providers</li>
          <li>List vehicles for sale</li>
          <li>Manage insurance claims</li>
        </ul>
      </div>
    `,
    service_center: `
      <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="color: #1976d2; margin-top: 0;">As a Service Center, you can:</h4>
        <ul>
          <li>Receive and manage service appointments</li>
          <li>Update vehicle service records</li>
          <li>Manage your business profile and certifications</li>
          <li>Track customer ratings and reviews</li>
          <li>Access analytics and reporting tools</li>
        </ul>
        <p><strong>Note:</strong> Your account requires verification before you can start accepting appointments.</p>
      </div>
    `,
    repair_center: `
      <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="color: #f57c00; margin-top: 0;">As a Repair Center, you can:</h4>
        <ul>
          <li>Handle accident repairs and insurance claims</li>
          <li>Manage repair appointments and estimates</li>
          <li>Update repair progress and documentation</li>
          <li>Coordinate with insurance companies</li>
          <li>Maintain detailed repair histories</li>
        </ul>
        <p><strong>Note:</strong> Your account requires verification before you can start accepting repair jobs.</p>
      </div>
    `,
    insurance_agent: `
      <div style="background-color: #fce4ec; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="color: #c2185b; margin-top: 0;">As an Insurance Agent, you can:</h4>
        <ul>
          <li>Process and manage insurance claims</li>
          <li>Authorize repair work and estimates</li>
          <li>Track claim statuses and settlements</li>
          <li>Communicate with repair centers and vehicle owners</li>
          <li>Access comprehensive claim analytics</li>
        </ul>
        <p><strong>Note:</strong> Your account requires verification before you can process claims.</p>
      </div>
    `,
    police: `
      <div style="background-color: #f3e5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="color: #7b1fa2; margin-top: 0;">As a Police Officer, you can:</h4>
        <ul>
          <li>Access vehicle information for investigations</li>
          <li>File accident reports and traffic violations</li>
          <li>Track vehicle histories and ownership</li>
          <li>Coordinate with insurance companies on claims</li>
          <li>Generate official reports and documentation</li>
        </ul>
        <p><strong>Note:</strong> Your account requires department verification.</p>
      </div>
    `,
    system_admin: `
      <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="color: #d32f2f; margin-top: 0;">As a System Administrator, you can:</h4>
        <ul>
          <li>Manage all user accounts and verifications</li>
          <li>Access comprehensive system analytics</li>
          <li>Configure platform settings and policies</li>
          <li>Monitor system performance and security</li>
          <li>Generate administrative reports</li>
        </ul>
      </div>
    `,
  };

  return content[role] || "";
};

// Send password reset email
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetURL = `${
    process.env.FRONTEND_URL || "http://localhost:3001"
  }/auth/reset-password/${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Password Reset Request</h1>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p>You requested a password reset for your AutoConnect account.</p>
      
      <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h3 style="color: #856404; margin-top: 0;">Security Notice</h3>
        <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" 
           style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset My Password
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        This link will expire in 10 minutes for security reasons.
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px; text-align: center;">
        AutoConnect Security Team<br>
        If you're having trouble clicking the button, copy and paste this URL into your browser:<br>
        ${resetURL}
      </p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: "AutoConnect - Password Reset Request",
    html,
    message: `Password reset requested. Use this link to reset your password: ${resetURL}`,
  });
};

// Send verification status update email
export const sendVerificationStatusEmail = async (user, isApproved) => {
  const subject = `AutoConnect - Account ${
    isApproved ? "Approved" : "Rejected"
  }`;
  const statusColor = isApproved ? "#28a745" : "#dc3545";
  const statusText = isApproved ? "APPROVED" : "REJECTED";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: ${statusColor}; text-align: center;">Account ${statusText}</h1>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      
      <div style="background-color: ${
        isApproved ? "#d4edda" : "#f8d7da"
      }; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid ${statusColor};">
        <h3 style="color: ${statusColor}; margin-top: 0;">Verification Update</h3>
        <p>Your ${user.role.replace(
          "_",
          " "
        )} account has been <strong>${statusText}</strong>.</p>
        ${
          isApproved
            ? "<p>You can now access all features of the platform and start using AutoConnect services.</p>"
            : "<p>Please contact our support team if you believe this decision was made in error.</p>"
        }
      </div>
      
      ${
        isApproved
          ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || "http://localhost:3001"}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Access Your Dashboard
          </a>
        </div>
      `
          : ""
      }
      
      <p>If you have any questions, please contact our support team.</p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px; text-align: center;">
        AutoConnect Admin Team
      </p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject,
    html,
    message: `Your account has been ${statusText.toLowerCase()}.`,
  });
};

// Send email verification email
export const sendEmailVerificationEmail = async (user, verificationToken) => {
  const verifyURL = `${
    process.env.FRONTEND_URL || "http://localhost:3001"
  }/auth/verify-email/${verificationToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Verify Your Email Address</h1>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p>Thank you for registering with AutoConnect. To complete your registration, please verify your email address.</p>
      
      <div style="background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #1976d2;">
        <h3 style="color: #1976d2; margin-top: 0;">Email Verification Required</h3>
        <p>Click the button below to verify your email address and activate your account.</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyURL}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        This verification link will expire in 24 hours for security reasons.
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px; text-align: center;">
        AutoConnect Team<br>
        If you're having trouble clicking the button, copy and paste this URL into your browser:<br>
        ${verifyURL}
      </p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: "AutoConnect - Verify Your Email Address",
    html,
    message: `Please verify your email address: ${verifyURL}`,
  });
};

// Send appointment confirmation email
export const sendAppointmentConfirmationEmail = async (
  appointment,
  user,
  serviceProvider
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Appointment Confirmed</h1>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p>Your service appointment has been confirmed with ${
        serviceProvider.businessInfo.businessName
      }.</p>
      
      <div style="background-color: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
        <h3 style="color: #28a745; margin-top: 0;">Appointment Details</h3>
        <p><strong>Service Provider:</strong> ${
          serviceProvider.businessInfo.businessName
        }</p>
        <p><strong>Date:</strong> ${new Date(
          appointment.scheduledDate
        ).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date(
          appointment.scheduledDate
        ).toLocaleTimeString()}</p>
        <p><strong>Service Type:</strong> ${appointment.serviceType}</p>
        <p><strong>Estimated Cost:</strong> LKR ${appointment.estimatedCost}</p>
      </div>
      
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="color: #856404; margin-top: 0;">Important Notes:</h4>
        <ul>
          <li>Please arrive 15 minutes before your scheduled time</li>
          <li>Bring your vehicle registration and insurance documents</li>
          <li>Contact the service provider if you need to reschedule</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p><strong>Service Provider Contact:</strong></p>
        <p>📞 ${serviceProvider.phone}</p>
        <p>📧 ${serviceProvider.email}</p>
        <p>📍 ${serviceProvider.address.street}, ${
    serviceProvider.address.city
  }</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px; text-align: center;">
        AutoConnect - Your Vehicle Care Partner
      </p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: "AutoConnect - Appointment Confirmation",
    html,
    message: `Your appointment with ${serviceProvider.businessInfo.businessName} has been confirmed.`,
  });
};

// Send service completion notification
export const sendServiceCompletionEmail = async (
  service,
  user,
  serviceProvider
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Service Completed</h1>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p>Your vehicle service has been completed by ${
        serviceProvider.businessInfo.businessName
      }.</p>
      
      <div style="background-color: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
        <h3 style="color: #28a745; margin-top: 0;">Service Summary</h3>
        <p><strong>Service Type:</strong> ${service.serviceType}</p>
        <p><strong>Completion Date:</strong> ${new Date(
          service.completedDate
        ).toLocaleDateString()}</p>
        <p><strong>Total Cost:</strong> LKR ${service.actualCost}</p>
        <p><strong>Warranty Period:</strong> ${
          service.warranty?.period || "N/A"
        }</p>
      </div>
      
      ${
        service.notes
          ? `
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="color: #333; margin-top: 0;">Service Notes:</h4>
          <p>${service.notes}</p>
        </div>
      `
          : ""
      }
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${
          process.env.FRONTEND_URL || "http://localhost:3001"
        }/services/${service._id}/review" 
           style="background-color: #ffc107; color: #212529; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Rate This Service
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        Your feedback helps us maintain quality standards and helps other vehicle owners make informed decisions.
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px; text-align: center;">
        AutoConnect - Your Vehicle Care Partner
      </p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: "AutoConnect - Service Completed",
    html,
    message: `Your vehicle service has been completed by ${serviceProvider.businessInfo.businessName}.`,
  });
};

// Send insurance claim notification
export const sendInsuranceClaimEmail = async (claim, user, insuranceAgent) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Insurance Claim Update</h1>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p>There has been an update to your insurance claim.</p>
      
      <div style="background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #1976d2;">
        <h3 style="color: #1976d2; margin-top: 0;">Claim Details</h3>
        <p><strong>Claim Number:</strong> ${claim.claimNumber}</p>
        <p><strong>Status:</strong> ${claim.status.toUpperCase()}</p>
        <p><strong>Claim Amount:</strong> LKR ${claim.claimAmount}</p>
        <p><strong>Date Filed:</strong> ${new Date(
          claim.dateSubmitted
        ).toLocaleDateString()}</p>
      </div>
      
      ${
        claim.assessorNotes
          ? `
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="color: #333; margin-top: 0;">Assessor Notes:</h4>
          <p>${claim.assessorNotes}</p>
        </div>
      `
          : ""
      }
      
      <div style="text-align: center; margin: 30px 0;">
        <p><strong>Insurance Agent Contact:</strong></p>
        <p>📞 ${insuranceAgent.phone}</p>
        <p>📧 ${insuranceAgent.email}</p>
        <p>🏢 ${insuranceAgent.businessInfo.businessName}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${
          process.env.FRONTEND_URL || "http://localhost:3001"
        }/claims/${claim._id}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Claim Details
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px; text-align: center;">
        AutoConnect - Your Vehicle Care Partner
      </p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: `AutoConnect - Insurance Claim Update (${claim.claimNumber})`,
    html,
    message: `Your insurance claim ${claim.claimNumber} has been updated.`,
  });
};

// Send system maintenance notification
export const sendMaintenanceNotificationEmail = async (
  users,
  maintenanceInfo
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Scheduled Maintenance Notice</h1>
      <p>Dear AutoConnect User,</p>
      <p>We will be performing scheduled maintenance on our platform.</p>
      
      <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h3 style="color: #856404; margin-top: 0;">Maintenance Schedule</h3>
        <p><strong>Start Time:</strong> ${new Date(
          maintenanceInfo.startTime
        ).toLocaleString()}</p>
        <p><strong>End Time:</strong> ${new Date(
          maintenanceInfo.endTime
        ).toLocaleString()}</p>
        <p><strong>Duration:</strong> ${maintenanceInfo.duration}</p>
        <p><strong>Impact:</strong> ${maintenanceInfo.impact}</p>
      </div>
      
      <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="color: #1976d2; margin-top: 0;">What to Expect:</h4>
        <ul>
          <li>Platform may be temporarily unavailable</li>
          <li>Some features may have limited functionality</li>
          <li>Emergency contact numbers will remain active</li>
        </ul>
      </div>
      
      <p>We apologize for any inconvenience and appreciate your patience as we work to improve our services.</p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px; text-align: center;">
        AutoConnect Technical Team
      </p>
    </div>
  `;

  // Send to all users (implement batch sending for large user bases)
  for (const user of users) {
    try {
      await sendEmail({
        email: user.email,
        subject: "AutoConnect - Scheduled Maintenance Notice",
        html,
        message: `Scheduled maintenance: ${new Date(
          maintenanceInfo.startTime
        ).toLocaleString()} - ${new Date(
          maintenanceInfo.endTime
        ).toLocaleString()}`,
      });
    } catch (error) {
      LOG.error({
        message: "Failed to send maintenance notification",
        userId: user._id,
        email: user.email,
        error: error.message,
      });
    }
  }
};

// Send bulk email utility
export const sendBulkEmail = async (recipients, emailOptions) => {
  const results = {
    successful: 0,
    failed: 0,
    errors: [],
  };

  for (const recipient of recipients) {
    try {
      await sendEmail({
        email: recipient.email,
        subject: emailOptions.subject,
        html: emailOptions.html
          .replace(/{{firstName}}/g, recipient.firstName)
          .replace(/{{lastName}}/g, recipient.lastName)
          .replace(/{{email}}/g, recipient.email),
        message: emailOptions.message,
      });
      results.successful++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        email: recipient.email,
        error: error.message,
      });

      LOG.error({
        message: "Bulk email failed for recipient",
        email: recipient.email,
        error: error.message,
      });
    }
  }

  LOG.info({
    message: "Bulk email completed",
    successful: results.successful,
    failed: results.failed,
    totalRecipients: recipients.length,
  });

  return results;
};

// Email template generator utility
export const generateEmailTemplate = (templateName, data) => {
  const templates = {
    generic: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">${data.title}</h1>
        <p>Dear ${data.firstName} ${data.lastName},</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          ${data.content}
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          AutoConnect Team
        </p>
      </div>
    `,
  };

  return templates[templateName]
    ? templates[templateName](data)
    : templates.generic(data);
};

// Email validation utility
export const validateEmailAddress = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Test email connectivity
export const testEmailConnection = async () => {
  try {
    const transporter = createTransport();
    await transporter.verify();

    LOG.info({
      message: "Email connection test successful",
      environment: process.env.NODE_ENV,
    });

    return { success: true, message: "Email service is working" };
  } catch (error) {
    LOG.error({
      message: "Email connection test failed",
      error: error.message,
      environment: process.env.NODE_ENV,
    });

    return { success: false, message: error.message };
  }
};
