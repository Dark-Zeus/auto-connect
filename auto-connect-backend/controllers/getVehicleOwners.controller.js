import User from "../models/user.model.js"; // adjust the import path if needed

// ✅ Fetch all users with role = "vehicle_owner"
const getAllVehicleOwners = async (req, res) => {
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

const getVehicleOwnerByNic = async (req, res) => {
  try {
    const nic = req.params.nic;
    const owner = await User.findOne({ role: "vehicle_owner", nicNumber: nic });
    res.status(200).json({
      success: true,
      data: owner,
    });
  } catch (error) {
    console.error("Error fetching vehicle owner by NIC:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle owner by NIC",
    });
  }
};

export { 
  getAllVehicleOwners,
  getVehicleOwnerByNic 
};
