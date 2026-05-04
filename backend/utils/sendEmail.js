const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const emailTemplates = {
  emailVerify: ({ name, verifyUrl }) => ({
    subject: 'Verify Your Email - ShopNow',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
        <div style="background:#1a1a2e;padding:30px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#e94560;margin:0">ShopNow</h1>
        </div>
        <div style="background:#fff;padding:30px;border-radius:0 0 8px 8px">
          <h2>Hello ${name}! 👋</h2>
          <p>Thanks for registering. Please verify your email to get started:</p>
          <a href="${verifyUrl}" style="display:inline-block;background:#e94560;color:#fff;padding:14px 30px;border-radius:6px;text-decoration:none;font-weight:bold;margin:20px 0">Verify Email</a>
          <p style="color:#666;font-size:13px">Link expires in 24 hours. If you didn't register, ignore this email.</p>
        </div>
      </div>
    `
  }),

  resetPassword: ({ name, resetUrl }) => ({
    subject: 'Password Reset - ShopNow',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
        <div style="background:#1a1a2e;padding:30px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#e94560;margin:0">ShopNow</h1>
        </div>
        <div style="background:#fff;padding:30px;border-radius:0 0 8px 8px">
          <h2>Password Reset</h2>
          <p>Hi ${name}, you requested to reset your password:</p>
          <a href="${resetUrl}" style="display:inline-block;background:#e94560;color:#fff;padding:14px 30px;border-radius:6px;text-decoration:none;font-weight:bold;margin:20px 0">Reset Password</a>
          <p style="color:#666;font-size:13px">This link expires in 15 minutes. If you didn't request this, please ignore.</p>
        </div>
      </div>
    `
  }),

  orderConfirmation: ({ name, order }) => ({
    subject: `Order Confirmed! #${order.orderId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
        <div style="background:#1a1a2e;padding:30px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#e94560;margin:0">ShopNow</h1>
        </div>
        <div style="background:#fff;padding:30px;border-radius:0 0 8px 8px">
          <h2>🎉 Order Confirmed!</h2>
          <p>Hi ${name}, your order <strong>#${order.orderId}</strong> has been placed successfully.</p>
          <div style="background:#f5f5f5;padding:15px;border-radius:6px;margin:15px 0">
            <p><strong>Total:</strong> ₹${order.totalPrice}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod.toUpperCase()}</p>
            <p><strong>Status:</strong> ${order.orderStatus}</p>
          </div>
          <h3>Items:</h3>
          ${order.items.map(item => `<p>${item.name} × ${item.quantity} = ₹${item.price * item.quantity}</p>`).join('')}
        </div>
      </div>
    `
  }),

  orderStatus: ({ name, order, status }) => ({
    subject: `Order ${status.charAt(0).toUpperCase() + status.slice(1)} - #${order.orderId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
        <div style="background:#1a1a2e;padding:30px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#e94560;margin:0">ShopNow</h1>
        </div>
        <div style="background:#fff;padding:30px;border-radius:0 0 8px 8px">
          <h2>Order Update</h2>
          <p>Hi ${name}, your order <strong>#${order.orderId}</strong> is now <strong>${status}</strong>.</p>
          ${order.trackingNumber ? `<p>Tracking Number: <strong>${order.trackingNumber}</strong></p>` : ''}
        </div>
      </div>
    `
  }),
};

const sendEmail = async ({ email, subject, template, data, html }) => {
  const emailContent = template && emailTemplates[template]
    ? emailTemplates[template](data)
    : { subject, html };

  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: emailContent.subject || subject,
    html: emailContent.html || html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
