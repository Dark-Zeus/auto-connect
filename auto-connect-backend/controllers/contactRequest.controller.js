import contactService from "../services/contactRequest.service.js";

// Create a new contact request
export const createContact = async (req, res) => {
  try {
    const contact = await contactService.createContact(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all contact requests
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactService.getAllContacts();
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update contact (reply or status)
export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await contactService.updateContact(id, req.body);

    if (!updated)
      return res.status(404).json({ success: false, message: "Contact not found" });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete contact
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await contactService.deleteContact(id);

    if (!deleted)
      return res.status(404).json({ success: false, message: "Contact not found" });

    res.status(200).json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const replyContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    if (!reply || !reply.trim()) {
      return res.status(400).json({ success: false, message: "Reply message is required" });
    }

    const updated = await contactService.updateContact(id, { reply, status: "resolved" });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Reply saved and request marked as resolved",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};