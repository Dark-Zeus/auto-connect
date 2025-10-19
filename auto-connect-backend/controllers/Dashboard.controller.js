import User from "../models/user.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    // total users
    const totalUsers = await User.countDocuments();

        // total verified service hubs (role = "serviceHub" and verified = true)
    const totalServiceHubs = await User.countDocuments({
      role: "service_center",
    });

    // total verified insurance companies (role = "insuranceCompany" and verified = true)
    const totalInsuranceCompanies = await User.countDocuments({
      role: "insurance_agent",
    });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalServiceHubs,
        totalInsuranceCompanies,
      },
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
