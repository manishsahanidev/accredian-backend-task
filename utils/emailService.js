require("dotenv").config();
const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(referrerName, referrerEmail, friendName, friendEmail) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.SENDER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `SENDER_NAME <${process.env.SENDER_EMAIL}>`,
      to: friendEmail,
      subject: `Referral from ${referrerName}`,
      text: `Hi ${friendName},\n\n${referrerName} (${referrerEmail}) has referred you.\n\nBest Regards,\nYour Company`,
      html: `<h1>Hi ${friendName},</h1><p>${referrerName} (${referrerEmail}) has referred you.</p><p>Best Regards,<br>Your Company</p>`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
}

module.exports = { sendMail };
