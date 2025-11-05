# Setting Up Vercel Blob for Feedback Storage

## Quick Setup (Free on Hobby Plan!)

Vercel Blob is **free** on the Hobby plan with 500GB bandwidth per month - perfect for feedback storage!

### Setup via Vercel Dashboard

1. **Go to your project on Vercel**: `https://vercel.com/[your-username]/gcp-tutorial-ui`

2. **Navigate to Storage tab** (in the top menu)

3. **Click "Create"** next to **"Blob"** (shows "Fast object storage")

4. **Name your store**: `feedback-store` (or any name you prefer)

5. **Click "Create"**

6. **Connect to your project**: 
   - It should automatically connect to `gcp-tutorial-ui`
   - Select all environments: `Production`, `Preview`, and `Development`

7. **Pull environment variables locally**:
   ```bash
   vercel env pull .env.local
   ```

### Verify Setup

After setup, your `.env.local` should contain:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

## Testing

1. **Start development server**:
   ```bash
   npm run dev
   # or
   bun dev
   ```

2. **Test feedback**: Visit your app and try voting on a lesson

3. **Check Blob storage**: Go to Vercel Dashboard → Storage → Your Blob store to see stored files

## How It Works

- Each vote is stored as a separate JSON file: `feedback/{lessonId}/{hash}.json`
- User IP is hashed for privacy
- One file per user per lesson = automatic deduplication
- **FREE** on Hobby plan (500GB bandwidth/month)

## Troubleshooting

### Error: "Feedback service not configured"
- Make sure `.env.local` exists with `BLOB_READ_WRITE_TOKEN`
- Restart your dev server after adding environment variables
- Run `vercel env pull .env.local` to get the latest variables

### Error: "Unauthorized" or fetch errors
- Check that `BLOB_READ_WRITE_TOKEN` is correct
- Re-pull environment variables: `vercel env pull .env.local`

### Local development without Blob
If you want to develop without Blob setup, the app will show a warning but won't crash. Feedback simply won't be saved.

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
