import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const smtp = nodemailer.createTransport({
  host: process.env.AUTO_CONNECT_SMTP_HOST,
  port: process.env.AUTO_CONNECT_SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.AUTO_CONNECT_SMTP_EMAIL,
    pass: process.env.AUTO_CONNECT_SMTP_KEY,
  },
});

export default smtp;  