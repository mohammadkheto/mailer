// Import required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();
const port = 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for CORS
app.use(cors());

// Define allowed origins
const allowedOrigins = ['http://localhost:3001', 'https://doptica.online'];

// CORS middleware
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    },
}));

// POST route to handle form submissions
app.post('/send', async (req, res) => {
    const { name, email, text, subject, html } = req.body;

    // Validate form data
    if (!name || !email || !text) {
        return res.status(400).json({ message: 'Please fill in all fields (name, email, text)' });
    }

    try {
        // Send email
        await sendEmail(name, email, text, subject, html);
        res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
        user: process.env.OUR_EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});

// Function to send email
async function sendEmail(name, email, text, subject = 'doptica contact us', html) {
    const mailOptions = {
        from: `${name} <${email}>`,
        to: process.env.OUR_EMAIL,
        subject,
        text: text || 'Hello world?',
        html: html || undefined,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
}

// Start the server
app.listen(port, () => {
    console.log('Server is running on port', port);
});
