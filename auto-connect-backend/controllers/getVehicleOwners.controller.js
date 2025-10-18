import User from "../models/user.model.js"; // adjust the import path if needed

// ✅ Fetch all users with role = "vehicle_owner"
export const getAllVehicleOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: "vehicle_owner" });

    res.status(200).json({
      success: true,
      data: owners,
    });
  } catch (error) {
    console.error("Error fetching vehicle owners:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle owners",
    });
  }
};
