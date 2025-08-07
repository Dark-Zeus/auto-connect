import ListVehicle from "../models/listVehicle.model.js";

export const createVehicleAd = async (req, res) => {
  try {
    const vehicleData = req.body;
    
    // Ensure views is 0
    vehicleData.views = 0;
    
    // Override with authenticated user data if available
    if (req.user) {
      vehicleData.userId = req.user._id;
      // If name is coming empty, rebuild it from user object
      if (!vehicleData.name || vehicleData.name === "undefined undefined") {
        vehicleData.name = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim();
      }
      // If email is empty, use from user object
      if (!vehicleData.email) {
        vehicleData.email = req.user.email;
      }
    }

    const newAd = new ListVehicle(vehicleData);
    await newAd.save();

    res.status(201).json({ success: true, message: "Vehicle ad created", data: newAd });
  } catch (err) {
    console.error("Error creating vehicle ad:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};