import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const smtp = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_KEY,
  },
});

export default smtp;  