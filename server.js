require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve all HTML, CSS, JS, images from root

// Nodemailer transporter (Gmail with App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ========================
// PARTNERSHIP FORM ENDPOINT
// ========================
app.post('/submit-partnership', async (req, res) => {
  try {
    // Match actual field names from partners.html
    if (!req.body['org-name'] || !req.body['contact-name'] || !req.body.email) {
      return res.status(400).send('Missing required fields');
    }

    let emailBody = '🚀 NEW PARTNERSHIP INQUIRY\n\n';
    emailBody += `Organization: ${req.body['org-name'] || 'Not provided'}\n`;
    emailBody += `Contact Person: ${req.body['contact-name'] || 'Not provided'}\n`;
    emailBody += `Email: ${req.body.email}\n`;
    emailBody += `Phone: ${req.body.phone || 'Not provided'}\n`;
    emailBody += `Website: ${req.body.website || 'Not provided'}\n`;
    emailBody += `Organization Type: ${req.body['org-type'] || 'Not provided'}\n`;
    emailBody += `Job Title: ${req.body['contact-title'] || 'Not provided'}\n\n`;

    emailBody += `=== PARTNERSHIP INTEREST ===\n`;
    emailBody += `Types: ${req.body['partnership-types'] ? req.body['partnership-types'].toString() : 'None selected'}\n`;
    emailBody += `Geographic Focus: ${req.body['geographic-focus'] || 'Not specified'}\n`;
    emailBody += `Timeline: ${req.body.timeline || 'Not specified'}\n\n`;

    emailBody += `=== RESOURCES & PROPOSAL ===\n`;
    emailBody += `Budget Range: ${req.body['budget-range'] || 'Not provided'}\n`;
    emailBody += `Team Size: ${req.body['team-size'] || 'Not provided'}\n`;
    emailBody += `Experience:\n${req.body.experience || 'Not provided'}\n\n`;
    emailBody += `Proposal:\n${req.body.proposal || 'Not provided'}\n\n`;
    emailBody += `Goals:\n${req.body.goals || 'Not provided'}\n\n`;
    emailBody += `Additional Info:\n${req.body['additional-info'] || 'None'}\n`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'limaplus945@gmail.com',
      replyTo: req.body.email,
      subject: `Partnership Inquiry - ${req.body['org-name'] || req.body['contact-name']}`,
      text: emailBody
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Partnership email sent successfully for:', req.body.email || 'unknown');

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><title>Thank You</title></head>
      <body style="text-align:center;padding:100px;font-family:sans-serif;background:#f0f7f4;">
        <h1 style="color:#1B4332;">Thank You!</h1>
        <p>Your partnership inquiry has been received.</p>
        <p>We will contact you within 1-2 business days.</p>
        <a href="/partners.html" style="color:#1B4332;font-weight:bold;">← Return to Partners page</a>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).send('Server error – please try again later');
  }
});

// ========================
// CONTACT FORM ENDPOINT
// ========================
app.post('/submit-contact', async (req, res) => {
  try {
    // Match actual field names from contact.html
    if (!req.body['first-name'] || !req.body['last-name'] || !req.body.email) {
      return res.status(400).send('Missing required fields');
    }

    let emailBody = '📩 NEW CONTACT MESSAGE\n\n';
    emailBody += `Name: ${req.body['first-name']} ${req.body['last-name']}\n`;
    emailBody += `Email: ${req.body.email}\n`;
    emailBody += `Phone: ${req.body.phone || 'Not provided'}\n`;
    emailBody += `Organization: ${req.body.organization || 'Not provided'}\n`;
    emailBody += `Subject: ${req.body.subject || 'General Inquiry'}\n\n`;
    emailBody += `Message:\n${req.body.message || 'No message provided'}\n\n`;
    emailBody += `Newsletter: ${req.body.newsletter ? 'Subscribed' : 'Not subscribed'}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'limaplus945@gmail.com',
      replyTo: req.body.email,
      subject: `Contact Form - ${req.body['first-name']} ${req.body['last-name']}`,
      text: emailBody
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Contact email sent successfully for:', req.body.email || 'unknown');

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><title>Thank You</title></head>
      <body style="text-align:center;padding:100px;font-family:sans-serif;background:#f0f7f4;">
        <h1 style="color:#1B4332;">Message Sent Successfully!</h1>
        <p>Thank you for reaching out. We will reply within 24-48 hours.</p>
        <a href="/contact.html" style="color:#1B4332;font-weight:bold;">← Return to Contact page</a>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).send('Server error – please try again later');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
