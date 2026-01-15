/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Email Authority System
 */
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

export const sendEmail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
    try {
        const info = await transporter.sendMail({
            from: `"Black Moss & Herbs" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
        });
        console.log(`[Email System] Message sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('[Email System] CRITICAL_FAILURE:', error);
        return { success: false, error };
    }
};

/**
 * Send Welcome Email
 */
export const sendWelcomeEmail = async (email: string, name: string) => {
    return sendEmail({
        to: email,
        subject: 'Welcome to the Black Moss & Herbs Circle',
        html: `
            <div style="font-family: serif; color: #1a1a1a; padding: 40px; background-color: #f2f9f4;">
                <h1 style="color: #2f5233;">Welcome, ${name}</h1>
                <p>Your biological restoration path has begun. You are now part of a global collective dedicated to alkaline mastery.</p>
                <p>Explore our latest formulas and protocol wisdom at <a href="https://blackmossandherbs.com">blackmossandherbs.com</a>.</p>
                <hr style="border: 0; border-top: 1px solid #c5e2cc; margin: 30px 0;" />
                <p style="font-size: 10px; color: #6d6d6d;">HECTIC Intellectual Property - All Rights Reserved</p>
            </div>
        `,
    });
};
