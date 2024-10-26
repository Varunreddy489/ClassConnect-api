
import dotenv from "dotenv";
import { SendEmailParams } from "../types/Server-types";
import nodemailer from 'nodemailer';
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST as string,
  port: parseInt(process.env.SMTP_PORT as string, 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ toMail, subject, body }: SendEmailParams) => {
  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: toMail,
    subject: subject,
    html: body,
  });
};
