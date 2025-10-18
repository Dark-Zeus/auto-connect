import express from "express";
import {
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
  replyContact, // controller for reply
} from "../controllers/contactRequest.controller.js";

const router = express.Router();

// CRUD routes
router.post("/", createContact); // Create new contact request
router.get("/", getAllContacts); // Get all contact requests
router.put("/:id", updateContact); // Update (status or reply)
router.delete("/:id", deleteContact); // Delete contact

// Reply route
router.put("/:id/reply", replyContact);

export default router;
