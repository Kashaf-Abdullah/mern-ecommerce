# Deploy the backend to Vercel

1. Import the repository into Vercel and set the project's **Root Directory** to `backend`. Vercel detects the exported Express app in `server.js`.
2. Add the backend environment variables in **Project Settings → Environment Variables**:
   - Required: `MONGO_URI`, `JWT_SECRET`
   - For Stripe payments, set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
   - For Razorpay payments, set both `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
   - Set `FRONTEND_URL` to the deployed frontend's origin so CORS and email links use the right domain.
   - For image uploads, set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
   - For email, set `SMTP_HOST`, `SMTP_PORT`, `SMTP_EMAIL`, `SMTP_PASSWORD`, `FROM_NAME`, and `FROM_EMAIL`.
   Payment providers, image uploads, and email are unavailable until their respective settings are configured.
3. Deploy. Check `https://<your-vercel-domain>/api/health`; it should return an API health response.
4. Update `REACT_APP_API_BASE_URL` in the frontend's deployment environment (and `frontend/.env` for local use) to the backend origin, for example `https://<your-vercel-domain>`. The frontend adds `/api` automatically. Rebuild/redeploy the frontend after changing its environment variable.

Do not commit environment secrets. Image uploads use Cloudinary; Vercel's local filesystem is not persistent.
