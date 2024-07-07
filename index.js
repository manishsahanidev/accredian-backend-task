require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const { sendMail } = require("./utils/emailService.js");

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());

app.post("/api/referrals", async (req, res) => {
  try {
    const { referrerName, referrerEmail, friendName, friendEmail } = req.body;

    const newReferral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        friendName,
        friendEmail,
      },
    });

    await sendMail(referrerName, referrerEmail, friendName, friendEmail);

    res.status(201).json(newReferral);
  } catch (error) {
    console.error("Error processing referral:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
