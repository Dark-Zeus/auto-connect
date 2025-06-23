require("dotenv").config();

const SMTPPool = require("nodemailer/lib/smtp-pool");
const smtp = require("../configs/email.config");

/**
 * 
 * @param {string[]} receivers 
 * @param {string} subject 
 * @param {string} html 
 * @param {string} text 
 * @returns {SMTPPool.SentMessageInfo}
 */
const send = async (receivers, subject, html, text) => {
    try {
        const info = await smtp.sendMail({
          from: `${process.env.AUTO_CONNECT_SMTP_USER} <${process.env.AUTO_CONNECT_SMTP_EMAIL}>`,
          to: receivers.join(', '),
          subject: subject, 
          text: text, 
          html: html,
        });

        return info;
    }catch(error){
        console.log(error);
    }
}
module.exports = {send};