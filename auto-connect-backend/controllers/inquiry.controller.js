import smtp from "../configs/email.config.js";
import LOG from "../configs/log.config.js";
import { sendEmail } from "../utils/email.util.js";
import ListVehicle from "../models/listVehicle.model.js";
import User from "../models/user.model.js";

export const sendAdInquiry = async (req, res, next) => {
  try {
    const { listingId, name, email, phone, enquiry } = req.body;

    if (!listingId || !name || !email || !phone || !enquiry) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const listing = await ListVehicle.findById(listingId).lean();
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const seller = await User.findById(listing.userId).lean();
    if (!seller || !seller.email) {
      return res.status(404).json({ message: "Seller not found for this listing" });
    }

    const make = listing.make || "";
    const model = listing.model || "";
    const year = listing.year || "";
    const title = listing.title || [year, make, model].filter(Boolean).join(" ").trim();
    const subject = `New inquiry for your listing: ${title || "Vehicle"}`;

    const sellerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
        <h2 style="margin:0 0 12px;">You have a new inquiry</h2>
        <p>Your listing: <strong>${title || "Vehicle"}</strong></p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
        <p style="margin:0 0 8px;"><strong>Message from buyer:</strong></p>
        <p style="white-space:pre-line">${enquiry}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
        <p style="margin:0 0 4px;"><strong>Buyer details</strong></p>
        <p style="margin:0;">Name: ${name}</p>
        <p style="margin:0;">Email: ${email}</p>
        <p style="margin:0;">Phone: ${phone}</p>
        <p style="margin:12px 0 0;">Reply directly to this email to contact the buyer.</p>
      </div>
    `;

    // Send email to seller with reply-to set to buyer's email
    await smtp.sendMail({
      from: `"AutoConnect Inquiries" <${process.env.AUTO_CONNECT_SMTP_EMAIL}>`,
      to: seller.email,
      subject,
      html: sellerHtml,
      text: `New inquiry for your listing "${title}".\n\nMessage:\n${enquiry}\n\nBuyer:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nReply to this email to contact the buyer.`,
      replyTo: `${name} <${email}>`,
      cc: email, // Buyer receives a copy
    });

    // Send confirmation to buyer using existing email util
    const buyerSubject = `Your inquiry has been sent: ${title || "Vehicle"}`;
    const buyerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
        <h2 style="margin:0 0 12px;">Inquiry sent successfully</h2>
        <p>We’ve sent your message to the seller of <strong>${title || "Vehicle"}</strong>.</p>
        <p>The seller can reply directly to your email. Keep an eye on your inbox.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
        <p style="margin:0 0 8px;"><strong>Your message:</strong></p>
        <p style="white-space:pre-line">${enquiry}</p>
      </div>
    `;

    await sendEmail({
      email,
      subject: buyerSubject,
      html: buyerHtml,
      message: `Your inquiry for "${title}" was sent to the seller.\n\nMessage:\n${enquiry}`,
    });

    LOG.info({
      message: "Inquiry email sent",
      listingId,
      sellerEmail: seller.email,
      buyerEmail: email,
    });

    return res.status(200).json({ message: "Inquiry sent successfully" });
  } catch (err) {
    LOG.error({
      message: "Failed to send inquiry",
      error: err.message,
      stack: err.stack,
    });
    return res.status(500).json({ message: "Failed to send inquiry" });
  }
};