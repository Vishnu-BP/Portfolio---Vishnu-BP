const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// @route POST /api/contact
// @desc Handle contact form submission (Phase 2.5)
// @access Public
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  // 1. Create a transporter object using secure SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Uses standard Gmail configuration
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // VITAL FIX: Force secure connection (SSL/TLS) required by Gmail/Render
    // Port 465 is the standard secure port
    secure: true,   
    port: 465       
  });

  // 2. Email content for the portfolio owner
  const mailOptionsToOwner = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Sends email to yourself
    subject: `NEW Portfolio Contact Message from ${name}`,
    html: `
        <h3>New Contact Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
    `,
  };

  // 3. Email content for confirmation to the sender (optional)
  const mailOptionsToSender = {
    from: process.env.EMAIL_USER,
    to: email, // Sends confirmation to the user
    subject: 'Thank You for Contacting Vishnu BP!',
    html: `
        <p>Hi ${name},</p>
        <p>Thank Thank you for reaching out! I have received your message and will get back to you within 24 hours.</p>
        <p>Best regards,</p>
        <p>Vishnu BP</p>
    `,
  };

  try {
    // Send email to portfolio owner
    await transporter.sendMail(mailOptionsToOwner);
    
    // Send confirmation email to the sender
    await transporter.sendMail(mailOptionsToSender);

    res.status(200).json({ message: 'Message sent successfully! Check your email for confirmation.' });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    // Provide a clearer error message related to the most common cause
    res.status(500).json({ message: 'Failed to send message. Please ensure your EMAIL_PASS is a valid Google App Password.' });
  }
});

module.exports = router;