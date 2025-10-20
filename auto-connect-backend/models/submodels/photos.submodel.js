import mongoose from "mongoose";
import { FileMetaSchema } from "./fileMeta.submodel.js";

const PhotosSchema = new mongoose.Schema(
  {
    front: { type: FileMetaSchema, required: true },
    back: { type: FileMetaSchema, required: true },
    left: { type: FileMetaSchema, required: true },
    right: { type: FileMetaSchema, required: true },
    special: { type: [FileMetaSchema], default: [] }, // up to 5 in UI; enforce if you want
  },
  { _id: false }
);

export { PhotosSchema };