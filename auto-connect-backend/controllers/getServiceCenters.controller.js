import User from "../models/user.model.js"; // adjust the import path if needed

// ✅ Fetch all users with role = "service_center"
export const getAllServiceCenters = async (req, res) => {
  try {
    const serviceCenters = await User.find({ role: "service_center" });

    res.status(200).json({
      success: true,
      data: serviceCenters,
    });
  } catch (error) {
    console.error("Error fetching service centers:", error);
    res.status(500).json({
        success: false,
        message: "Failed to fetch service centers",
    });
  }
};