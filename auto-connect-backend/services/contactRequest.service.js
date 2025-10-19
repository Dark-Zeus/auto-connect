import ContactRequest from "../models/contactRequest.model.js";

// Create a new contact request
export const createContact = async (data) => {
  const { name, email, subject, message, category, priority } = data;

  const contact = new ContactRequest({
    name,
    email,
    subject,
    message,
    category,
    priority: priority || "medium",
  });

  return await contact.save();
};

// Get all contact requests (newest first)
export const getAllContacts = async () => {
  return await ContactRequest.find().sort({ createdAt: -1 });
};

// Get a single contact by ID
export const getContactById = async (id) => {
  return await ContactRequest.findById(id);
};

// Update a contact request (for reply or status updates)
export const updateContact = async (id, updates) => {
  return await ContactRequest.findByIdAndUpdate(id, updates, { new: true });
};

// Delete a contact request
export const deleteContact = async (id) => {
  return await ContactRequest.findByIdAndDelete(id);
};

// Reply to a contact and mark as resolved
export const replyToContact = async (id, replyMessage) => {
  return await ContactRequest.findByIdAndUpdate(
    id,
    { reply: replyMessage, status: "resolved" },
    { new: true }
  );
};

export default {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  replyToContact,
};
