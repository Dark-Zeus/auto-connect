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
    // registrationNumber: { type: String, required: true },
    photos: [String],
    views: { type: Number, default: 0 }, // <--- important
    status: { type: Number, default: 1 }, // 1 for active, 0 for inactive
    paymentStatus: {type: String, enum: ['pending', 'completed', 'failed'], default: 'pending'},
    checkoutSessionId: { type: String, index: true },
    promotion: { type: Number, enum: [0, 1], default: 0 } // 0 for no promotion, 1 for promoted
    }, { timestamps: true });

    listVehicleSchema.virtual("bumpSchedule", {
    ref: "BumpSchedule",
    localField: "_id",
    foreignField: "adId",
    justOne: true,
    });

    listVehicleSchema.set("toObject", { virtuals: true });
    listVehicleSchema.set("toJSON", { virtuals: true });

    listVehicleSchema.pre(/^find/, function (next) {
    this.populate({
        path: "bumpSchedule",
        select: "createdAt lastBumpTime nextBumpTime remainingBumps isActive intervalHours",
    });
    next();
    });

    listVehicleSchema.statics.updateVehicleAd = async function (id, userId, updateData) {
        // Only allow the owner to update
        return this.findOneAndUpdate(
            { _id: id, userId },
            updateData,
            { new: true }
        );
    };

    listVehicleSchema.statics.softDeleteVehicleAd = async function (id, userId) {
        // Only allow the owner to soft delete
        return this.findOneAndUpdate(
            { _id: id, userId },
            { status: 0 },
            { new: true }
        );
    };

export default mongoose.model('ListVehicle', listVehicleSchema);