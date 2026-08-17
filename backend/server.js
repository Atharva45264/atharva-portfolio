const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Resend } = require("resend");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================================
   RESEND
========================================= */

const resend = new Resend(process.env.RESEND_API_KEY);

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
       EMAIL CONTENT
    ------------------------------------- */

    const { data, error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM ||
        "Atharva Portfolio <onboarding@resend.dev>",

      to: [process.env.EMAIL_TO],

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

Sent from Atharva Phanse's portfolio website.
      `,

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #1C231D;
            max-width: 650px;
            margin: 0 auto;
            padding: 20px;
          "
        >

          <h2 style="color: #2F6C4F;">
            New Portfolio Message
          </h2>

          <hr style="border: none; border-top: 1px solid #ddd;" />

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

          <hr style="border: none; border-top: 1px solid #ddd;" />

          <p style="color: #777; font-size: 13px;">
            Sent from Atharva Phanse's portfolio website.
          </p>

        </div>
      `,
    });

    /* -------------------------------------
       RESEND ERROR
    ------------------------------------- */

    if (error) {
      console.error("Resend error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to send message right now.",
      });
    }

    /* -------------------------------------
       SUCCESS
    ------------------------------------- */

    console.log("Email sent successfully:", data);

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