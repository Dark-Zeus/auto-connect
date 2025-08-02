// configs/multer.config.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import LOG from "./log.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
const vehicleUploadsDir = path.join(uploadDir, "vehicles");
const documentUploadsDir = path.join(vehicleUploadsDir, "documents");
const imageUploadsDir = path.join(vehicleUploadsDir, "images");

// Ensure directories exist
[uploadDir, vehicleUploadsDir, documentUploadsDir, imageUploadsDir].forEach(
  (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      LOG.info(`Created upload directory: ${dir}`);
    }
  }
);

// File filter function
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedImageTypes = /\.(jpg|jpeg|png|gif|webp)$/i;
  const allowedDocumentTypes = /\.(pdf|doc|docx|txt|jpg|jpeg|png)$/i;

  const isImage = allowedImageTypes.test(file.originalname);
  const isDocument = allowedDocumentTypes.test(file.originalname);

  if (isImage || isDocument) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images (jpg, jpeg, png, gif, webp) and documents (pdf, doc, docx, txt) are allowed."
      ),
      false
    );
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;

    // Determine upload path based on file type and route
    if (req.route.path.includes("/images")) {
      uploadPath = imageUploadsDir;
    } else if (req.route.path.includes("/documents")) {
      uploadPath = documentUploadsDir;
    } else {
      // Default to documents
      uploadPath = documentUploadsDir;
    }

    // Create vehicle-specific directory if vehicleId is provided
    if (req.params.id) {
      uploadPath = path.join(uploadPath, req.params.id);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp_userId_originalname
    const uniqueSuffix = `${Date.now()}_${req.user._id}`;
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);

    // Clean filename - remove special characters
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, "_");

    const filename = `${uniqueSuffix}_${cleanBaseName}${fileExtension}`;
    cb(null, filename);
  },
});

// Multer configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Maximum 5 files at once
  },
});

// Multiple file upload configurations
export const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10, // Maximum 10 files at once
  },
});

// Memory storage for temporary file processing
export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for memory storage
  },
});

// Error handler for multer errors
export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    LOG.error("Multer error:", error);

    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "File size too large. Maximum size is 10MB.",
          error: "FILE_TOO_LARGE",
        });
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          message: "Too many files. Maximum 5 files allowed at once.",
          error: "TOO_MANY_FILES",
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: "Unexpected field in file upload.",
          error: "UNEXPECTED_FIELD",
        });
      default:
        return res.status(400).json({
          success: false,
          message: "File upload error.",
          error: error.code,
        });
    }
  } else if (error.message.includes("Invalid file type")) {
    return res.status(400).json({
      success: false,
      message: error.message,
      error: "INVALID_FILE_TYPE",
    });
  }

  next(error);
};

// Utility function to delete uploaded files
export const deleteUploadedFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      LOG.info(`Deleted file: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    LOG.error("Error deleting file:", error);
    return false;
  }
};

// Clean up old temporary files (run this periodically)
export const cleanupTempFiles = () => {
  const tempDir = path.join(uploadDir, "temp");
  if (!fs.existsSync(tempDir)) return;

  try {
    const files = fs.readdirSync(tempDir);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    files.forEach((file) => {
      const filePath = path.join(tempDir, file);
      const stat = fs.statSync(filePath);

      if (now - stat.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
        LOG.info(`Cleaned up old temp file: ${file}`);
      }
    });
  } catch (error) {
    LOG.error("Error cleaning up temp files:", error);
  }
};

// Middleware to validate file uploads
export const validateFileUpload = (fileType = "any") => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
        error: "NO_FILE_UPLOADED",
      });
    }

    const file = req.file || (req.files && req.files[0]);

    if (fileType === "image" && !file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Please upload only image files.",
        error: "INVALID_IMAGE_TYPE",
      });
    }

    if (
      fileType === "document" &&
      !file.mimetype.includes("pdf") &&
      !file.mimetype.includes("document")
    ) {
      // Allow images as document uploads (for scanned documents)
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message:
            "Please upload only document files (PDF, DOC, DOCX) or images.",
          error: "INVALID_DOCUMENT_TYPE",
        });
      }
    }

    next();
  };
};
