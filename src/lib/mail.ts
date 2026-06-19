import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: process.env.EMAIL_SERVER_PORT === '465',
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
})

const BRAND_COLOR = '#2d6a4f'
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://blackmossandherbs.com'

function emailWrapper(content: string): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:560px;width:100%;">
        <tr><td style="background:${BRAND_COLOR};padding:24px 32px;">
          <span style="color:#fff;font-size:22px;font-weight:bold;font-family:Georgia,serif;">Black Moss &amp; Herbs</span>
        </td></tr>
        <tr><td style="padding:32px;">${content}</td></tr>
        <tr><td style="background:#f9f9f9;padding:20px 32px;border-top:1px solid #eee;">
          <p style="margin:0;font-size:11px;color:#888;line-height:1.5;">
            © ${new Date().getFullYear()} Black Moss &amp; Herbs · <a href="${SITE_URL}" style="color:#888;">blackmossandherbs.com</a><br>
            Food supplements. Not intended to diagnose, treat, cure or prevent any disease. Consult your GP before use.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
    try {
        const info = await transporter.sendMail({
            from: `"Black Moss & Herbs" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
        })
        console.log('[mail] sent:', info.messageId)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('[mail] send failed:', error)
        return { success: false, error }
    }
}

export const sendWelcomeEmail = async (email: string, name: string) =>
    sendEmail({
        to: email,
        subject: 'Welcome to Black Moss & Herbs',
        html: emailWrapper(`
            <h2 style="color:#1a1a1a;font-size:22px;margin:0 0 16px;">Welcome, ${name}!</h2>
            <p style="color:#444;line-height:1.6;margin:0 0 16px;">
                Thank you for creating your Black Moss &amp; Herbs account. We're glad you're here.
            </p>
            <p style="color:#444;line-height:1.6;margin:0 0 24px;">
                You can now browse our full range of wildcrafted sea moss and herbal blends, track your orders, and access exclusive member resources.
            </p>
            <a href="${SITE_URL}/shop" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:13px 26px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">
                Shop Now
            </a>
        `),
    })

export const sendOrderConfirmationEmail = async (
    email: string,
    name: string,
    orderNumber: string,
    items: Array<{ name: string; quantity: number; price: number }>,
    total: number
) =>
    sendEmail({
        to: email,
        subject: `Order confirmed — ${orderNumber}`,
        html: emailWrapper(`
            <h2 style="color:#1a1a1a;font-size:22px;margin:0 0 8px;">Order confirmed ✓</h2>
            <p style="color:#666;margin:0 0 24px;">Hi ${name}, we've received your order and we're getting it ready.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;margin-bottom:24px;">
                <tr style="background:#f9f9f9;">
                    <td style="padding:10px 16px;font-size:12px;font-weight:bold;color:#888;text-transform:uppercase;">Item</td>
                    <td style="padding:10px 16px;font-size:12px;font-weight:bold;color:#888;text-transform:uppercase;text-align:right;">Price</td>
                </tr>
                ${items.map(i => `
                <tr>
                    <td style="padding:12px 16px;border-top:1px solid #eee;color:#333;">${i.name} × ${i.quantity}</td>
                    <td style="padding:12px 16px;border-top:1px solid #eee;color:#333;text-align:right;">£${(i.price * i.quantity).toFixed(2)}</td>
                </tr>`).join('')}
                <tr style="background:#f9f9f9;">
                    <td style="padding:12px 16px;border-top:2px solid #ddd;font-weight:bold;color:#1a1a1a;">Total</td>
                    <td style="padding:12px 16px;border-top:2px solid #ddd;font-weight:bold;color:#1a1a1a;text-align:right;">£${total.toFixed(2)}</td>
                </tr>
            </table>
            <p style="color:#666;font-size:13px;margin:0 0 8px;">Order reference: <strong>${orderNumber}</strong></p>
            <p style="color:#666;font-size:13px;margin:0 0 24px;">You'll receive a dispatch email with tracking once your order ships. Standard delivery is 2–4 working days.</p>
            <a href="${SITE_URL}/dashboard/orders" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:13px 26px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">
                View Order
            </a>
        `),
    })

export const sendConsultationConfirmationEmail = async (
    email: string,
    name: string,
    consultationType: string,
    date: string,
    time: string
) =>
    sendEmail({
        to: email,
        subject: 'Consultation booking received — Black Moss & Herbs',
        html: emailWrapper(`
            <h2 style="color:#1a1a1a;font-size:22px;margin:0 0 16px;">Booking received ✓</h2>
            <p style="color:#444;line-height:1.6;margin:0 0 16px;">
                Hi ${name}, we've received your consultation request. A member of our team will confirm your appointment and send you a video call link within 24 hours.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;margin-bottom:24px;">
                <tr><td style="padding:12px 16px;color:#888;font-size:13px;border-bottom:1px solid #eee;width:140px;">Session type</td><td style="padding:12px 16px;color:#333;font-size:13px;border-bottom:1px solid #eee;">${consultationType}</td></tr>
                <tr><td style="padding:12px 16px;color:#888;font-size:13px;border-bottom:1px solid #eee;">Requested date</td><td style="padding:12px 16px;color:#333;font-size:13px;border-bottom:1px solid #eee;">${date}</td></tr>
                <tr><td style="padding:12px 16px;color:#888;font-size:13px;">Requested time</td><td style="padding:12px 16px;color:#333;font-size:13px;">${time}</td></tr>
            </table>
            <p style="color:#888;font-size:12px;line-height:1.5;">Our practitioners provide general wellness guidance only. They are not medical doctors and do not provide medical diagnoses, prescriptions or treatment plans. Always consult your GP for medical concerns.</p>
        `),
    })

export const sendPasswordResetEmail = async (email: string, resetUrl: string) =>
    sendEmail({
        to: email,
        subject: 'Reset your Black Moss & Herbs password',
        html: emailWrapper(`
            <h2 style="color:#1a1a1a;font-size:22px;margin:0 0 16px;">Reset your password</h2>
            <p style="color:#444;line-height:1.6;margin:0 0 24px;">
                We received a request to reset the password for your account. Click the button below to set a new password. This link is valid for 1 hour.
            </p>
            <a href="${resetUrl}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:13px 26px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;margin-bottom:24px;">
                Reset Password
            </a>
            <p style="color:#999;font-size:12px;margin:0;">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
        `),
    })
