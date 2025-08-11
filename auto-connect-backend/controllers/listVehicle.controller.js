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