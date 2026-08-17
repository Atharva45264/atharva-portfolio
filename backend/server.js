const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================================
   MIDDLEWARE
========================================= */

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json());

/* =========================================
   HEALTH CHECK
========================================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Atharva Portfolio API is running",
  });
});

/* =========================================
   CONTACT FORM
========================================= */

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    /* -------------------------------------
       VALIDATION
    ------------------------------------- */

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    if (!email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    /* -------------------------------------
       EMAIL TRANSPORTER
    ------------------------------------- */

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    /* -------------------------------------
       EMAIL CONTENT
    ------------------------------------- */

    const mailOptions = {
      from: process.env.EMAIL_USER,

      to: process.env.EMAIL_TO,

      replyTo: email,

      subject: `Portfolio Contact: ${name}`,

      text: `
You received a new message from your portfolio.

Name:
${name}

Email:
${email}

Message:
${message}
      `,

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1C231D;">

          <h2 style="color: #2F6C4F;">
            New Portfolio Message
          </h2>

          <hr />

          <p>
            <strong>Name:</strong><br />
            ${name}
          </p>

          <p>
            <strong>Email:</strong><br />
            ${email}
          </p>

          <p>
            <strong>Message:</strong><br />
            ${message.replace(/\n/g, "<br />")}
          </p>

          <hr />

          <p style="color: #777;">
            Sent from Atharva Phanse's portfolio website.
          </p>

        </div>
      `,
    };

    /* -------------------------------------
       SEND EMAIL
    ------------------------------------- */

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully.",
    });

  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
});

/* =========================================
   START SERVER
========================================= */

app.listen(PORT, () => {
  console.log(`Portfolio backend running on port ${PORT}`);
});