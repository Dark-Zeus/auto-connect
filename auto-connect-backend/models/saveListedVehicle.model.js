import mongoose from "mongoose";

const saveListedVehicleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "ListVehicle", required: true },
  make: String,
  model: String,
  year: Number,
  city: String,
  district: String,
  price: Number,
  mileage: Number,
  fuelType: String,
  postedDate: Date,
}, { timestamps: true });

export default mongoose.model("SavedAd", saveListedVehicleSchema);