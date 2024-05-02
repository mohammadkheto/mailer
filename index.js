"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, text, subject, html } = req.body;
    console.log(req.body);
    if (!name || !email || !text) {
        return res.status(400).json({ message: 'Please fill in all fields (text & email $ name)' });
    }
    try {
        yield sendEmail(name, email, text, subject, html);
        res.status(200).json({ message: 'Email sent' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
const transporter = nodemailer_1.default.createTransport({
    service: 'Outlook365',
    auth: {
        user: process.env.OUR_EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});
function sendEmail(name, email, text, subject, html) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailOptions = {
            from: `${name} <${email}>`,
            to: process.env.OUR_EMAIL,
            subject: subject || 'doptica contact us',
            text: text || 'Hello world?',
            html: html || undefined,
        };
        const info = yield transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    });
}
let allowedOrigins = ['http://localhost:3001', 'https://doptica.online'];
app.use((0, cors_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    },
}));
app.listen(port, () => {
    console.log('app ready port: ', port);
});
// sendEmail().catch(console.error);
