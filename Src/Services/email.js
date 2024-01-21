"use strict";
import nodemailer from "nodemailer";
export async function sendEmail(to,subject,html) {

const transporter = nodemailer.createTransport({
 service:'gmail',
  auth: {
    user:process.env.EMAIL,
    pass: process.env.PASS,
  },
});

  const info = await transporter.sendMail({
    from: `"OnlineLibrary 🔖📚" <${process.env.EMAIL}>`, // sender address
    to:to, // list of receivers
    subject:subject, // Subject line
    html: html, // html body
  });

}

