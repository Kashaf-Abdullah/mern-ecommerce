jest.mock('../models/User', () => ({
  findOne: jest.fn(),
}));
jest.mock('../utils/sendEmail', () => jest.fn());

const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { forgotPassword } = require('../controllers/authController');

describe('forgot password reset link', () => {
  const originalFrontendUrl = process.env.FRONTEND_URL;

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    if (originalFrontendUrl === undefined) {
      delete process.env.FRONTEND_URL;
    } else {
      process.env.FRONTEND_URL = originalFrontendUrl;
    }
  });

  it('uses the deployed frontend when FRONTEND_URL is missing', async () => {
    delete process.env.FRONTEND_URL;
    const user = {
      email: 'customer@example.com',
      name: 'Customer',
      getResetPasswordToken: jest.fn().mockReturnValue('reset-token'),
      save: jest.fn().mockResolvedValue(undefined),
    };
    User.findOne.mockResolvedValue(user);
    sendEmail.mockResolvedValue(undefined);

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await forgotPassword({ body: { email: user.email } }, response, jest.fn());

    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({
      data: {
        name: user.name,
        resetUrl: 'https://kashaf-ecommerce.netlify.app/reset-password/reset-token',
      },
    }));
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it('removes a trailing slash from the configured frontend URL', async () => {
    process.env.FRONTEND_URL = 'https://shop.example/';
    const user = {
      email: 'customer@example.com',
      name: 'Customer',
      getResetPasswordToken: jest.fn().mockReturnValue('reset-token'),
      save: jest.fn().mockResolvedValue(undefined),
    };
    User.findOne.mockResolvedValue(user);
    sendEmail.mockResolvedValue(undefined);

    await forgotPassword(
      { body: { email: user.email } },
      { status: jest.fn().mockReturnThis(), json: jest.fn() },
      jest.fn(),
    );

    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({
      data: {
        name: user.name,
        resetUrl: 'https://shop.example/reset-password/reset-token',
      },
    }));
  });
});
