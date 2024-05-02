import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();
const app = express();
const port = 3000;


app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.post('/send', async (req, res) => {
    const { name, email, text, subject, html } = req.body;
    console.log(req.body);
    if (!name || !email || !text) {
        return res.status(400).json({ message: 'Please fill in all fields (text & email $ name)' });
    }
    try {
        await sendEmail(name, email, text, subject, html);
        res.status(200).json({ message: 'Email sent' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

const transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
        user: process.env.OUR_EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});

async function sendEmail(name: string, email: string, text: string, subject?: string, html?: string) {
    const mailOptions = {
        from: `${name} <${email}>`,
        to: process.env.OUR_EMAIL,
        subject: subject || 'doptica contact us',
        text: text || 'Hello world?',
        html: html || undefined,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  
}
let allowedOrigins = ['http://localhost:3001', 'https://doptica.online'];
app.use(cors());
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
                return callback(new Error(message), false);
            }
            return callback(null, true);
        },
    })
);


app.listen(port, () => {
    console.log('app ready port: ', port);
});

// sendEmail().catch(console.error);
