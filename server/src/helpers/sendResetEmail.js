// src/helpers/sendResetEmail.js
"use strict";
const nodemailer = require("nodemailer");

const sendResetEmail = async (to, subject, message) => {
  const mailSettings = {
    service: "Gmail",
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  };

  const transporter = nodemailer.createTransport({
    service: mailSettings.service,
    auth: {
      user: mailSettings.user,
      pass: mailSettings.pass,
    },
  });

  const mailOptions = {
    from: mailSettings.user,
    to: to,
    subject: subject,
    text: message,
    html: message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
