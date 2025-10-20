import mongoose from "mongoose";

const FileMetaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },           // where the file lives (S3, GCS, etc.)
    mimeType: { type: String },                      // e.g., image/jpeg, application/pdf
    sizeBytes: { type: Number },                     // optional, for validation/limits
    width: { type: Number },                         // for images (if known)
    height: { type: Number },                        // for images (if known)
    durationSec: { type: Number },                   // for video/audio (if known)
    originalName: { type: String },                  // client-side file name
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

export { FileMetaSchema };