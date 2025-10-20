import insuranceClaimService from "../services/insuranceClaim.service.js";
import util from "util";

const toRelativeUploadsPath = (absPath) => {
  const norm = absPath.replace(/\\/g, "/");
  const idx = norm.lastIndexOf("/uploads/");
  return idx >= 0 ? norm.slice(idx) : norm; // -> "/uploads/..."
};

const fileMeta = (f) => ({
  url: toRelativeUploadsPath(f.path),   // 👈 relative path stored in FileMetaSchema.url
  mimeType: f.mimetype,
  sizeBytes: f.size,
  originalName: f.originalname,
  uploadedAt: new Date(),
});

const firstFile = (files, key) =>
  Array.isArray(files?.[key]) && files[key].length ? files[key][0] : null;

const allFiles = (files, key) => (Array.isArray(files?.[key]) ? files[key] : []);

const combineIncidentAt = (dateStr, timeStr) =>
  dateStr && timeStr ? new Date(`${dateStr}T${timeStr}:00`) : undefined;

const toBool = (v) => v === true || v === "true" || v === "on" || v === "1";

// --- controller ---
export const createInsuranceClaim = async (req, res, next) => {
  try {
    // Text fields from multipart form
    const {
      vehicleNumber,
      incidentType,
      incidentAt,
      incidentLocation,
      description,
      additionalComments,
      insurancePolicyRef,
      vehicleRef,
      customerRef,
      confirmation,
    } = req.body;

    // Files from multer
    const fFront = firstFile(req.files, "photos[front]");
    const fBack = firstFile(req.files, "photos[back]");
    const fLeft = firstFile(req.files, "photos[left]");
    const fRight = firstFile(req.files, "photos[right]");
    const fSpecial = allFiles(req.files, "photos[special][]");
    const fSignature = firstFile(req.files, "digitalSignature");
    const fPolice = firstFile(req.files, "policeReport");
    const fVideo = firstFile(req.files, "video");

    // Build photos block (matches PhotosSchema/FileMetaSchema)
    const photos = {
      front: fFront ? fileMeta(fFront) : undefined,
      back: fBack ? fileMeta(fBack) : undefined,
      left: fLeft ? fileMeta(fLeft) : undefined,
      right: fRight ? fileMeta(fRight) : undefined,
      special: fSpecial.map(fileMeta),
    };

    const claimData = {
      // Prefer refs if you pass them; keep vehicleNumber for quick lookup if desired
      vehicleNumber: vehicleNumber || undefined,
      insurancePolicyRef: insurancePolicyRef || undefined,
      vehicleRef: vehicleRef || undefined,
      customerRef: customerRef || req.user?._id, // if you use auth

      incidentType,
      incidentAt: incidentAt ? new Date(incidentAt) : undefined,
      incidentLocation,
      description,
      additionalComments,

      photos,
      digitalSignature: fSignature ? toRelativeUploadsPath(fSignature.path) : undefined, // string URL (relative)
      policeReport: fPolice ? fileMeta(fPolice) : undefined,
      video: fVideo ? fileMeta(fVideo) : undefined,

      confirmation: toBool(confirmation),
      status: "Pending",
    };

    console.log("Creating insurance claim with data:", claimData);

    // Minimal server validations (keep or adjust as you like)
    for (const k of ["front", "back", "left", "right"]) {
      if (!claimData.photos?.[k]) {
        return res.status(400).json({ success: false, message: `Missing required photo: ${k}` });
      }
    }
    if (!claimData.digitalSignature) {
      return res.status(400).json({ success: false, message: "Digital signature is required" });
    }
    if (!claimData.incidentType || !claimData.incidentAt || !claimData.incidentLocation || !claimData.description) {
      return res.status(400).json({ success: false, message: "Missing required incident fields" });
    }
    if (claimData.confirmation !== true) {
      return res.status(400).json({ success: false, message: "Please confirm the information is correct" });
    }

    console.log("Creating insurance claim with data:", claimData);
    const newClaim = await insuranceClaimService.createInsuranceClaim(claimData);

    return res.status(201).json({
      success: true,
      message: "Insurance claim created successfully",
      data: newClaim,
    });
  } catch (err) {
    next(err);
  }
};

const getAllInsuranceClaims = async (req, res) => {
    try {
        const claims = await insuranceClaimService.getAllInsuranceClaims();
        res.status(200).json({
            success: true,
            message: "Insurance claims retrieved successfully",
            data: claims,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving insurance claims",
            error: error.message,
        });
    }
};

const getInsuranceClaimsByCustomer = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const claims = await insuranceClaimService.getInsuranceClaimsByCustomer(customerId);
        res.status(200).json({
            success: true,
            message: "Insurance claims for customer retrieved successfully",
            data: claims,
        });
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: "Error retrieving insurance claims for customer",
            error: error.message,
        });
    }
};

const getAllInsuranceClaimsByCompany = async (req, res) => {
    try {
        const companyId = req.body.userId || "IC123456"; // Will be retrieved from authenticated user in real scenario
        const claims = await insuranceClaimService.getAllInsuranceClaimsByCompany(companyId);
        res.status(200).json({
            success: true,
            message: "Insurance claims for company retrieved successfully",
            data: claims,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving insurance claims for company",
            error: error.message,
        });
    }
};

export default {
    createInsuranceClaim,
    getAllInsuranceClaims,
    getInsuranceClaimsByCustomer,
    getAllInsuranceClaimsByCompany,
};
