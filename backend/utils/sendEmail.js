import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const sendMail = async (email, subject, text, html = "", attachmentPath = "") => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use STARTTLS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            requireTLS: true,
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            text: text || undefined,
            html: html || "<p>HTML content not provided</p>",
            attachments: attachmentPath ? [{
                filename: path.basename(attachmentPath),
                path: attachmentPath,
                contentType: "application/pdf"
            }] : []
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent: ${info.messageId}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Failed to send email");
    }
};

export { sendMail };
