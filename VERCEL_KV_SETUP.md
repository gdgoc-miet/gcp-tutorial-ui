# Setting Up Vercel KV for Feedback Storage

## Quick Setup (Recommended)

### Option 1: Using Vercel Dashboard

1. **Go to your project on Vercel**: `https://vercel.com/[your-username]/gcp-tutorial-ui`

2. **Navigate to Storage tab** (in the top menu)

3. **Click "Create Database"** → Select **"KV"**

4. **Name your database**: `feedback-store` (or any name you prefer)

5. **Select region**: Choose the region closest to your users

6. **Click "Create"**

7. **Connect to your project**: 
   - Select your project: `gcp-tutorial-ui`
   - Select environment: `Production`, `Preview`, and `Development`
   - Click "Connect"

8. **Pull environment variables locally**:
   ```bash
   vercel env pull .env.local
   ```

### Option 2: Using Vercel CLI (Alternative)

If you prefer using the CLI, follow these steps:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel@latest
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link your project**:
   ```bash
   vercel link
   ```

4. **Create KV database via dashboard** (CLI storage creation is limited)
   - Go to https://vercel.com/dashboard
   - Follow Option 1 steps above

5. **Pull environment variables**:
   ```bash
   vercel env pull .env.local
   ```

## Verify Setup

After setup, your `.env.local` should contain:

```env
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

## Testing

1. **Start development server**:
   ```bash
   npm run dev
   # or
   bun dev
   ```

2. **Test feedback**: Visit your app and try voting on a lesson

3. **Check logs**: Look for any KV-related errors in the console

## Troubleshooting

### Error: "Feedback service not configured"
- Make sure `.env.local` exists with KV variables
- Restart your dev server after adding environment variables
- Verify variables are not empty

### Error: "Connection refused" or "Unauthorized"
- Check that `KV_REST_API_TOKEN` is correct
- Re-pull environment variables: `vercel env pull .env.local`

### Local development without KV
If you want to develop without KV setup, the app will show a warning but won't crash. Feedback simply won't be saved.

## Export Feedback Data

Once KV is set up, you can export all feedback data:

```bash
curl http://localhost:9002/api/export-feedback > feedback.csv
```

Or visit: `http://localhost:9002/api/export-feedback` in your browser to download.

## Production Deployment

When you deploy to Vercel, the KV environment variables are automatically injected. No additional setup needed!

```bash
git push origin main
# or
vercel --prod
```
