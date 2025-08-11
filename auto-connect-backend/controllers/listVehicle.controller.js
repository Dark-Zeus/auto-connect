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