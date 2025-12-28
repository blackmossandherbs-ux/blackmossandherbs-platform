/**
 * Email template utilities
 * Use with Resend or your email service
 */

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export function orderConfirmationEmail(data: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  shippingAddress: any;
}): EmailData {
  const { orderNumber, customerName, items, total, shippingAddress } = data;

  return {
    to: data.customerEmail,
    subject: `Order Confirmation #${orderNumber} - BlackMoss & Herbs`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #22c55e; margin: 0;">BlackMoss & Herbs</h1>
          </div>
          
          <h2 style="color: #333;">Order Confirmation</h2>
          <p>Hi ${customerName},</p>
          <p>Thank you for your order! We've received your order and are processing it now.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Order Number:</strong> ${orderNumber}</p>
          </div>
          
          <h3>Order Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            ${items
              .map(
                (item) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name} x ${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.price.toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
            <tr>
              <td style="padding: 10px; font-weight: bold;">Total</td>
              <td style="padding: 10px; text-align: right; font-weight: bold;">$${total.toFixed(2)}</td>
            </tr>
          </table>
          
          <h3>Shipping Address</h3>
          <p>
            ${shippingAddress.name}<br>
            ${shippingAddress.line1}<br>
            ${shippingAddress.line2 ? `${shippingAddress.line2}<br>` : ""}
            ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
            ${shippingAddress.country}
          </p>
          
          <p>We'll send you a tracking number once your order ships.</p>
          
          <p>Thank you for choosing BlackMoss & Herbs!</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            BlackMoss & Herbs<br>
            Premium Herbal Wellness Platform
          </p>
        </body>
      </html>
    `,
    text: `
Order Confirmation #${orderNumber}

Hi ${customerName},

Thank you for your order! We've received your order and are processing it now.

Order Number: ${orderNumber}

Order Details:
${items.map((item) => `- ${item.name} x ${item.quantity}: $${item.price.toFixed(2)}`).join("\n")}

Total: $${total.toFixed(2)}

Shipping Address:
${shippingAddress.name}
${shippingAddress.line1}
${shippingAddress.line2 ? `${shippingAddress.line2}\n` : ""}
${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}
${shippingAddress.country}

We'll send you a tracking number once your order ships.

Thank you for choosing BlackMoss & Herbs!
    `,
  };
}

export function welcomeEmail(data: { name: string; email: string }): EmailData {
  return {
    to: data.email,
    subject: "Welcome to BlackMoss & Herbs!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #22c55e;">Welcome to BlackMoss & Herbs!</h1>
          <p>Hi ${data.name},</p>
          <p>Thank you for joining our wellness community! We're excited to have you.</p>
          <p>Explore our premium herbal products, expert consultations, and wellness resources.</p>
          <p style="margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" style="background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Start Shopping
            </a>
          </p>
        </body>
      </html>
    `,
  };
}

export function passwordResetEmail(data: { name: string; email: string; resetToken: string }): EmailData {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${data.resetToken}`;

  return {
    to: data.email,
    subject: "Reset Your Password - BlackMoss & Herbs",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #22c55e;">Reset Your Password</h1>
          <p>Hi ${data.name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <p style="margin-top: 30px;">
            <a href="${resetUrl}" style="background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p>This link will expire in 1 hour.</p>
          <p style="font-size: 12px; color: #6b7280;">If you didn't request this, please ignore this email.</p>
        </body>
      </html>
    `,
  };
}
