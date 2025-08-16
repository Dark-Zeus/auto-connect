import ListVehicle from "../models/listVehicle.model.js";
import SavedAd from "../models/saveListedVehicle.model.js";

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

export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await ListVehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }
    res.status(200).json({ success: true, data: vehicle });
  } catch (err) {
    console.error("Error fetching vehicle by ID:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveAd = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { vehicleId } = req.body;

    if (!userId || !vehicleId) {
      return res.status(400).json({ success: false, message: "Missing userId or vehicleId" });
    }

    // Check if already saved
    const alreadySaved = await SavedAd.findOne({ userId, vehicleId });
    if (alreadySaved) {
      return res.status(409).json({ success: false, message: "Ad already saved" });
    }

    const savedAd = new SavedAd({ userId, vehicleId });
    await savedAd.save();

    res.status(201).json({ success: true, message: "Ad saved successfully", data: savedAd });
  } catch (err) {
    console.error("Error saving ad:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const unsaveAd = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { vehicleId } = req.body;

    if (!userId || !vehicleId) {
      return res.status(400).json({ success: false, message: "Missing userId or vehicleId" });
    }

    const deleted = await SavedAd.findOneAndDelete({ userId, vehicleId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Saved ad not found" });
    }

    res.status(200).json({ success: true, message: "Ad unsaved successfully" });
  } catch (err) {
    console.error("Error unsaving ad:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSavedAds = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const savedAds = await SavedAd.find({ userId }).populate('vehicleId');
    res.status(200).json({ success: true, data: savedAds });
  } catch (err) {
    console.error("Error fetching saved ads:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};