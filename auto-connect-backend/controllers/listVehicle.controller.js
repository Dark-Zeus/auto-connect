import ListVehicle from "../models/listVehicle.model.js";

// Only handle request/response, no business logic here
export const createVehicleAd = async (req, res) => {
  try {
    const vehicleData = req.body;
    const newAd = new ListVehicle(vehicleData);
    await newAd.save();
    res.status(201).json({ success: true, message: "Vehicle ad created", data: newAd });
  } catch (err) {
    console.error("Error creating vehicle ad:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getMyVehicleAds = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id; // depends on your auth middleware
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const myAds = await ListVehicle.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: myAds });
  } catch (err) {
    console.error("Error fetching user's vehicle ads:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getVehicleAdById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await ListVehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle ad not found" });
    }
    res.status(200).json({ success: true, data: vehicle });
  } catch (err) {
    console.error("Error fetching vehicle ad by ID:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateVehicleAd = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const updateData = req.body;
    const updatedAd = await ListVehicle.updateVehicleAd(id, userId, updateData);
    if (!updatedAd) {
      return res.status(404).json({ success: false, message: "Vehicle ad not found or not owned by user" });
    }
    res.status(200).json({ success: true, message: "Vehicle ad updated", data: updatedAd });
  } catch (err) {
    console.error("Error updating vehicle ad:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};