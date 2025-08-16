import mongoose from "mongoose";

const saveListedVehicleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "ListVehicle", required: true }
  // Remove make, model, year, city, district, price, mileage, fuelType, postedDate
}, { timestamps: true });

export default mongoose.model("SavedAd", saveListedVehicleSchema);