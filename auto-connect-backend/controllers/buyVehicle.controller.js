import ListVehicle from "../models/listVehicle.model.js";

export const getAvailableVehicles = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id; // Get the current user's ID
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch vehicles not listed by the current user
    const availableVehicles = await ListVehicle.find({ userId: { $ne: userId }, status: 1 }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: availableVehicles });
  } catch (err) {
    console.error("Error fetching available vehicles:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};