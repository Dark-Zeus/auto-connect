// configs/defaultRecords.config.js (Updated)
import User from "../models/user.model.js";
import LOG from "./log.config.js";

const addDefaultRecords = async () => {
  try {
    // Check if any system admin exists
    const adminCount = await User.countDocuments({ role: "system_admin" });

    if (adminCount === 0) {
      // Create default system admin
      const defaultAdmin = await User.create({
        email: process.env.DEFAULT_ADMIN_EMAIL || "admin@autoconnect.lk",
        password: process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123456",
        firstName: "System",
        lastName: "Administrator",
        phone: "+94771234567",
        role: "system_admin",
        address: {
          street: "AutoConnect Headquarters",
          city: "Colombo",
          district: "Colombo",
          province: "Western",
          postalCode: "00100",
        },
        isVerified: true,
        isActive: true,
        emailVerified: true,
        phoneVerified: true,
      });

      LOG.info({
        message: "Default system administrator created. Please change the password after first login.",
        adminId: defaultAdmin._id,
        email: defaultAdmin.email,
        phone: defaultAdmin.phone,
        password: process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123456",
      });
    }

    // Add other default records here if needed
    // For example: default service categories, vehicle makes/models, etc.
  } catch (error) {
    LOG.error({
      message: "Error creating default records",
      error: error.message,
      stack: error.stack,
    });
  }
};

export default addDefaultRecords;
