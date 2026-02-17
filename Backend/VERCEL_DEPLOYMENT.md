# Backend Vercel Deployment Instructions

## ✅ Changes Made for Vercel
1. Created `vercel.json` configuration
2. Created `api/index.js` serverless entry point
3. Updated `server.js` to export app for serverless
4. Added `.vercelignore` file

## 🚀 Deploy Steps

### Option 1: Via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository `thapahemraj/GenZmart`
4. **Important Settings:**
   - **Root Directory**: `Backend`
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

5. **Environment Variables** (Add these in Vercel):
   ```
   MONGODB_URI=mongodb+srv://GenZmart_db:ekrRROgKVZdqXUx6@genzmart-cluster.hxua7is.mongodb.net/
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   GOOGLE_CLIENT_ID=433287518957-dc98n5mp71lrs124h0ivlll5deeukp5b.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=demo 
   FRONTEND_URL=https://genzmart.vercel.app
   NODE_ENV=production
   ```

6. Click "Deploy"

### Option 2: Via Vercel CLI
```bash
cd /workspaces/GenZmart/Backend
vercel --prod
```

## 🔍 Testing After Deployment

Once deployed (e.g., `https://genzmart-backend.vercel.app`):

```bash
# Test health
curl https://your-backend-url.vercel.app/api/products

# Test with origin
curl -H "Origin: https://genzmart.vercel.app" \
     https://your-backend-url.vercel.app/api/products
```

## 📝 Update Frontend API URL

After backend is deployed, update client `.env`:
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

## ⚠️ Important Notes
- MongoDB IP whitelist must include `0.0.0.0/0` (allow all IPs)
- CORS is configured for `https://genzmart.vercel.app`
- All environment variables must be set in Vercel dashboard
- The backend will run as serverless functions

## 🔄 Redeploy
Any push to `main` branch will auto-deploy if GitHub integration is enabled.

## 🐛 Troubleshooting
- **500 Error**: Check Vercel logs for missing environment variables
- **CORS Error**: Verify FRONTEND_URL matches your client domain
- **MongoDB Error**: Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- **Route not found**: Backend is working! Just no root route defined (try `/api/products`)
