# Vercel Deployment Guide for WorkbridgeJobs

## Pre-deployment Setup

### 1. Prerequisites
- Vercel account (free tier available)
- Git repository (GitHub, GitLab, or Bitbucket)
- Firebase project with Firestore enabled

### 2. Environment Variables
Configure the following environment variables in Vercel dashboard:

**Required Firebase Environment Variables:**
```
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
NODE_ENV=production
```

### 3. Firebase Security Rules
Make sure to apply the production security rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Jobs collection - read only for clients
    match /jobs/{document} {
      allow read: if true;
      allow write: if false; // Only admin can write
    }
    
    // All other collections - restricted
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Deployment Steps

### 1. Push to Git Repository
Ensure all your code is committed and pushed to your Git repository.

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect the configuration

### 3. Configure Environment Variables
1. In the Vercel dashboard, go to your project settings
2. Navigate to "Environment Variables"
3. Add all the Firebase environment variables listed above

### 4. Deploy
Vercel will automatically build and deploy your application using the `vercel.json` configuration.

## Project Structure for Vercel

The application is configured with:

- **Frontend**: Built with Vite and served as static files
- **Backend**: Serverless API functions in `/api` directory
- **Build Output**: Static files in `dist/public`, API functions as serverless

## Configuration Files

### vercel.json
- Configures build process and routing
- Serverless function setup for API routes
- Static file serving for frontend

### Package.json Updates
- Added `vercel-build` script for optimized Vercel builds
- Maintains existing development and production scripts

## Post-deployment Verification

After deployment:

1. **Test the website**: Verify all pages load correctly
2. **Check job listings**: Ensure jobs display on all category pages
3. **Test pagination**: Verify pagination works across all pages
4. **Monitor performance**: Check Firebase usage in Firebase Console
5. **Check Vercel logs**: Monitor for any errors in Vercel dashboard

## Cost Optimization Features

Your application includes several cost-optimization features:

- **5-minute caching** for job data to reduce Firebase reads
- **Pagination** (6 jobs per page) to limit data transfer
- **Server-side pagination** to minimize Firebase queries
- **Production security rules** to prevent unauthorized access

## Expected Costs

With optimizations in place:
- **Vercel**: Free tier supports up to 100GB bandwidth monthly
- **Firebase**: Estimated <$1/month for 10k daily page views
- **Total**: Minimal cost for typical job site traffic

## Troubleshooting

### Common Issues:

1. **Build failures**: Check environment variables are set correctly
2. **API errors**: Verify Firebase configuration and security rules
3. **Static files not loading**: Check build output directory configuration
4. **Slow performance**: Monitor Firebase read operations and caching

### Debugging:
- Check Vercel function logs in dashboard
- Monitor Firebase usage in Firebase Console
- Use browser dev tools to check network requests

## Support

For deployment issues:
- Check Vercel documentation
- Review Firebase console errors
- Verify environment variable configuration
- Test locally with production build before deploying
