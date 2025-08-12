import mongoose from "mongoose";

const listVehicleSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Seller's user ID
    name: { type: String, required: true }, // Seller's name
    email: { type: String, required: true }, // Seller's email
    mobile: { type: String, required: true },
    district: { type: String, required: true },
    city: String,
    vehicleType: { type: String, required: true },
    condition: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: Number,
    ongoingLease: Boolean,
    transmission: { type: String, required: true },
    fuelType: { type: String, required: true },
    engineCapacity: Number,
    mileage: { type: Number, required: true },
    description: String,
    registrationNumber: { type: String, required: true },
    photos: [String],
    views: { type: Number, default: 0 }, // <--- important
    }, { timestamps: true });

    listVehicleSchema.statics.updateVehicleAd = async function (id, userId, updateData) {
        // Only allow the owner to update
        return this.findOneAndUpdate(
            { _id: id, userId },
            updateData,
            { new: true }
        );
    };

export default mongoose.model('ListVehicle', listVehicleSchema);