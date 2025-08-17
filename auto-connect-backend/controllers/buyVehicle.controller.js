import ListVehicle from "../models/listVehicle.model.js";
import SavedAd from "../models/saveListedVehicle.model.js";
import ReportAd from "../models/reportAds.model.js";

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

export const filterVehicles = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      urgency,
      district,
      city,
      vehicleType,
      make,
      model,
      minYear,
      maxYear,
      transmission,
      fuelType,
      condition,
      minPrice,
      maxPrice
    } = req.body;

    const filter = {
      userId: { $ne: userId },
      status: 1
    };

    // Urgency: promotion === 4
    if (urgency === 'true' || urgency === true) filter.promotion = 4;
    if (district) filter.district = district;
    if (city) filter.city = { $regex: city, $options: "i" };
    if (vehicleType) filter.vehicleType = vehicleType;
    if (make) filter.make = make;
    if (model) filter.model = { $regex: model, $options: "i" };
    if (transmission) filter.transmission = transmission;
    if (fuelType) filter.fuelType = fuelType;
    if (condition) filter.condition = condition;
    if (minYear) filter.year = { ...filter.year, $gte: Number(minYear) };
    if (maxYear) filter.year = { ...filter.year, $lte: Number(maxYear) };
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    const vehicles = await ListVehicle.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: vehicles });
  } catch (err) {
    console.error("Error filtering vehicles:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const reportAd = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { adId, issue, details } = req.body;

    if (!userId || !adId || !issue) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const report = new ReportAd({
      adId,
      userId,
      issue,
      details
    });

    await report.save();
    res.status(201).json({ success: true, message: "Report submitted successfully" });
  } catch (err) {
    console.error("Error reporting ad:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const checkIfReported = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { adId } = req.query;
    if (!userId || !adId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const alreadyReported = await ReportAd.findOne({ userId, adId });
    res.status(200).json({ success: true, reported: !!alreadyReported });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const incrementVehicleViews = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await ListVehicle.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }
    res.status(200).json({ success: true, views: vehicle.views });
  } catch (err) {
    console.error("Error incrementing vehicle views:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};