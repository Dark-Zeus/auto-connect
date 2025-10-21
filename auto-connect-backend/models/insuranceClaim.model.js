import mongoose from 'mongoose';
import { FileMetaSchema } from './submodels/fileMeta.submodel.js';
import { PhotosSchema } from './submodels/photos.submodel.js';

const InsuranceClaimSchema = new mongoose.Schema({
  insurancePolicyRef: { type: mongoose.Schema.Types.ObjectId, ref: 'InsurancePolicy', required: true },
  vehicleRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  customerRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  incidentType: {
    type: String,
    enum: [
      'Vehicle Collision', 'Hit and Run', 'Vehicle Theft', 'Fire Damage',
      'Flood Damage', 'Vandalism', 'Natural Disaster', 'Glass Breakage', 'Other'
    ],
    required: true,
  },
  incidentAt: { type: Date, required: true },
  incidentLocation: { type: String, required: true },
  description: { type: String, required: true },

  photos: { type: PhotosSchema, required: true },
  video: { type: FileMetaSchema },
  policeReport: { type: FileMetaSchema },
  additionalComments: { type: String },

  digitalSignature: { type: String, required: true },
  confirmation: { type: Boolean, required: true },
  status: { type: String, default: 'pending' },

  finalReport: {
    additionalNotes: { type: String },
    inspectionDate: { type: Date },
    inspectorName: { type: String },
    qualityRating: { type: Number, min: 1, max: 5 },
    repairsCompleted: { type: String },
    serviceProvider: { type: String },
    totalCost: { type: Number }
  },
}, { timestamps: true });

const InsuranceClaim = mongoose.model('InsuranceClaim', InsuranceClaimSchema);
export default InsuranceClaim;
