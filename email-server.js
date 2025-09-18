const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Email server is running' });
});

// Email configuration
const FROM_EMAIL = "sinugahlot0@gmail.com";
const FROM_PASS = "nccv rvor mqrq algr"; // App password

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: FROM_EMAIL,
        pass: FROM_PASS
    }
});

// Store verification codes temporarily (in production, use a database)
const verificationCodes = new Map();

// Generate verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate verification link
function generateVerificationLink(email, code) {
    const token = crypto.createHash('sha256').update(email + code + Date.now()).digest('hex');
    return `http://localhost:3000/verify?token=${token}&email=${encodeURIComponent(email)}&code=${code}`;
}

// Send verification email
app.post('/send-verification', async (req, res) => {
    try {
        const { email, username } = req.body;
        
        if (!email || !username) {
            return res.status(400).json({ error: 'Email and username are required' });
        }

        // Generate verification code
        const verificationCode = generateVerificationCode();
        const verificationLink = generateVerificationLink(email, verificationCode);
        
        // Store code temporarily (expires in 10 minutes)
        verificationCodes.set(email, {
            code: verificationCode,
            username: username,
            timestamp: Date.now(),
            expires: Date.now() + (10 * 60 * 1000) // 10 minutes
        });

        // Email template
        const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .code-box { background: #f8f9fa; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
                .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
                .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🧠 Quiz Master Verification</h1>
                    <p>Welcome to Quiz Master!</p>
                </div>
                <div class="content">
                    <h2>Hello ${username}!</h2>
                    <p>Thank you for registering with Quiz Master. To complete your registration and access the quiz platform, please use the verification code below:</p>
                    
                    <div class="code-box">
                        <div class="code">${verificationCode}</div>
                        <p>Enter this code in the login form</p>
                    </div>
                    
                    <p>Alternatively, you can click the button below to verify automatically:</p>
                    <div style="text-align: center;">
                        <a href="${verificationLink}" class="button">Verify My Account</a>
                    </div>
                    
                    <p><strong>Important:</strong></p>
                    <ul>
                        <li>This code is valid for 10 minutes only</li>
                        <li>Do not share this code with anyone</li>
                        <li>If you didn't request this, please ignore this email</li>
                    </ul>
                </div>
                <div class="footer">
                    <p>This email was sent from Quiz Master</p>
                    <p>Contact support: <a href="mailto:sinugahlot0@gmail.com">sinugahlot0@gmail.com</a></p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Send email
        const mailOptions = {
            from: `"Quiz Master" <${FROM_EMAIL}>`,
            to: email,
            subject: '🧠 Quiz Master - Email Verification Code',
            html: htmlTemplate,
            text: `Hello ${username}!\n\nYour Quiz Master verification code is: ${verificationCode}\n\nThis code is valid for 10 minutes.\n\nAlternatively, click this link to verify: ${verificationLink}\n\nBest regards,\nQuiz Master Team`
        };

        await transporter.sendMail(mailOptions);

        res.json({ 
            success: true, 
            message: 'Verification email sent successfully',
            code: verificationCode // Remove this in production
        });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ error: 'Failed to send verification email' });
    }
});

// Verify code
app.post('/verify-code', (req, res) => {
    try {
        const { email, code } = req.body;
        
        const storedData = verificationCodes.get(email);
        
        if (!storedData) {
            return res.status(400).json({ error: 'No verification code found for this email' });
        }
        
        if (Date.now() > storedData.expires) {
            verificationCodes.delete(email);
            return res.status(400).json({ error: 'Verification code has expired' });
        }
        
        if (storedData.code !== code) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }
        
        // Code is valid
        verificationCodes.delete(email);
        res.json({ success: true, message: 'Email verified successfully' });
        
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Verification link handler
app.get('/verify', (req, res) => {
    const { email, code } = req.query;
    
    const storedData = verificationCodes.get(email);
    
    if (!storedData || storedData.code !== code || Date.now() > storedData.expires) {
        return res.send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #dc3545;">❌ Verification Failed</h1>
                    <p>The verification link is invalid or has expired.</p>
                    <p>Please request a new verification code.</p>
                </body>
            </html>
        `);
    }
    
    // Verification successful
    verificationCodes.delete(email);
    res.send(`
        <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: #28a745;">✅ Email Verified Successfully!</h1>
                <p>Your email has been verified. You can now close this window and return to Quiz Master.</p>
                <script>
                    // Try to communicate with parent window
                    if (window.opener) {
                        window.opener.postMessage({type: 'EMAIL_VERIFIED', email: '${email}'}, '*');
                        setTimeout(() => window.close(), 2000);
                    }
                </script>
            </body>
        </html>
    `);
});

// Send feedback email
app.post('/send-feedback', async (req, res) => {
    try {
        const { username, email, difficulty, score, rating, feedback, completionTime } = req.body;

        const mailOptions = {
            from: `"Quiz Master Feedback" <${FROM_EMAIL}>`,
            to: 'ankitx3mummy941@gmail.com',
            subject: `Quiz Master Feedback from ${username}`,
            html: `
                <h2>New Feedback from Quiz Master</h2>
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Difficulty Level:</strong> ${difficulty}</p>
                <p><strong>Score:</strong> ${score}</p>
                <p><strong>Rating:</strong> ${rating}/5 stars</p>
                <p><strong>Completion Time:</strong> ${completionTime}</p>
                <h3>Feedback:</h3>
                <p>${feedback}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Feedback sent successfully' });

    } catch (error) {
        console.error('Feedback sending error:', error);
        res.status(500).json({ error: 'Failed to send feedback' });
    }
});

app.listen(PORT, () => {
    console.log(`Email server running on http://localhost:${PORT}`);
});