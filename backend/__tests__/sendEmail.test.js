jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

let nodemailer;

describe('sendEmail', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    nodemailer = require('nodemailer');
    process.env = { ...originalEnv };
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_EMAIL;
    delete process.env.SMTP_PASSWORD;
    delete process.env.FROM_NAME;
    delete process.env.FROM_EMAIL;
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
    nodemailer.createTransport.mockReset();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('uses existing Gmail credentials and defaults when SMTP settings are omitted', async () => {
    const sendMail = jest.fn().mockResolvedValue({});
    nodemailer.createTransport.mockReturnValue({ sendMail });
    process.env.EMAIL_USER = 'shopnow@gmail.com';
    process.env.EMAIL_PASS = 'app-password';
    const sendEmail = require('../utils/sendEmail');

    await sendEmail({
      email: 'customer@example.com',
      subject: 'Password Reset',
      template: 'resetPassword',
      data: { name: 'Customer', resetUrl: 'https://shopnow.example/reset' },
    });

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: 'shopnow@gmail.com', pass: 'app-password' },
    });
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: '"ShopNow" <shopnow@gmail.com>',
      to: 'customer@example.com',
    }));
  });

  it('requires an SMTP host for non-Gmail accounts', async () => {
    process.env.EMAIL_USER = 'shopnow@example.com';
    process.env.EMAIL_PASS = 'mail-password';
    const sendEmail = require('../utils/sendEmail');

    await expect(sendEmail({
      email: 'customer@example.com',
      subject: 'Password Reset',
      html: '<p>Reset password</p>',
    })).rejects.toThrow('Email is not configured');
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });
});
