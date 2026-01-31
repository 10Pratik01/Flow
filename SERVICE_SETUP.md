# Service Setup Guide

## 📋 Free Tier Services Overview

All services below have generous free tiers perfect for development and small-scale production:

---

## 1. 🖼️ Cloudinary (File Uploads)

**Free Tier**: 25GB storage, 25GB bandwidth/month

### Setup Steps:

1. Go to https://cloudinary.com/users/register_free
2. Sign up for a free account
3. Go to Dashboard: https://cloudinary.com/console
4. Copy your credentials:
   - Cloud Name
   - API Key
   - API Secret
5. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```

---

## 2. 🔄 Pusher (Real-time Updates)

**Free Tier**: 200,000 messages/day, 100 max connections

### Setup Steps:

1. Go to https://dashboard.pusher.com/accounts/sign_up
2. Create a free account
3. Create a new Channels app
4. Go to "App Keys" tab
5. Copy your credentials:
   - app_id
   - key
   - secret
   - cluster
6. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_PUSHER_KEY="your_key"
   NEXT_PUBLIC_PUSHER_CLUSTER="your_cluster"
   PUSHER_APP_ID="your_app_id"
   PUSHER_SECRET="your_secret"
   ```

**Alternative (Free)**: Supabase Realtime or Socket.io (self-hosted)

---

## 3. 📧 Resend (Email Notifications)

**Free Tier**: 100 emails/day, 3,000 emails/month

### Setup Steps:

1. Go to https://resend.com/signup
2. Create account
3. Go to API Keys: https://resend.com/api-keys
4. Create a new API key
5. Add to `.env.local`:
   ```bash
   RESEND_API_KEY="re_..."
   RESEND_FROM_EMAIL="noreply@yourdomain.com"
   ```

---

## 4. 🤖 Google Gemini (AI Features)

**Free Tier**: 60 requests/minute, 1,500 requests/day

### Setup Steps:

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy your API key
5. Add to `.env.local`:
   ```bash
   GEMINI_API_KEY="your_api_key"
   ```

### Usage Example:

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const result = await model.generateContent("Your prompt here");
console.log(result.response.text());
```

---

## 📦 Installed Packages

```bash
npm install @google/generative-ai cloudinary
```

---

## 🎯 Priority Setup

For immediate development, you only **need**:

- ✅ **NeonDB** (already configured)
- ✅ **Clerk** (already configured)

**Optional** (add when needed):

- Cloudinary - for file uploads
- Pusher - for real-time features
- Resend - for email notifications
- Gemini - for AI features

---

## 💰 Cost Comparison

| Service    | Free Tier                          | Best For                        |
| ---------- | ---------------------------------- | ------------------------------- |
| Cloudinary | 25GB storage, 25GB bandwidth       | Images, videos, transformations |
| Pusher     | 200k messages/day, 100 connections | Real-time updates               |
| Resend     | 100 emails/day                     | Transactional emails            |
| Gemini     | 60 req/min, 1500/day               | AI features, chat, analysis     |

All services have **generous free tiers** suitable for development and small production apps!
