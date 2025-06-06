# Vercel Deployment Checklist

## Pre-deployment Checklist

### ✅ Code Preparation
- [ ] All changes committed to Git repository
- [ ] Repository pushed to GitHub/GitLab/Bitbucket
- [ ] No sensitive data in code (environment variables only)
- [ ] Build runs successfully locally (`npm run build`)

### ✅ Firebase Setup
- [ ] Firebase project created and configured
- [ ] Firestore database enabled with data
- [ ] Production security rules applied to Firestore
- [ ] Firebase config values ready (from Firebase Console)

### ✅ Environment Variables Ready
- [ ] FIREBASE_API_KEY
- [ ] FIREBASE_AUTH_DOMAIN
- [ ] FIREBASE_PROJECT_ID
- [ ] FIREBASE_STORAGE_BUCKET
- [ ] FIREBASE_MESSAGING_SENDER_ID
- [ ] FIREBASE_APP_ID
- [ ] FIREBASE_MEASUREMENT_ID
- [ ] NODE_ENV=production

## Deployment Steps

### 1. Vercel Account Setup
- [ ] Signed up for Vercel account
- [ ] Connected Git provider (GitHub/GitLab/Bitbucket)

### 2. Project Import
- [ ] Clicked "New Project" in Vercel dashboard
- [ ] Selected your repository
- [ ] Vercel detected configuration automatically

### 3. Environment Configuration
- [ ] Added all Firebase environment variables in Vercel
- [ ] Set NODE_ENV to "production"
- [ ] Verified all variables are correct

### 4. Deployment
- [ ] Triggered initial deployment
- [ ] Build completed successfully
- [ ] No build errors reported

## Post-deployment Verification

### ✅ Functionality Testing
- [ ] Homepage loads and displays jobs
- [ ] Government jobs page works with pagination
- [ ] Municipality jobs page works with pagination
- [ ] Retail jobs page works with pagination
- [ ] Job details modal opens correctly
- [ ] Pagination controls work (prev/next/numbers)

### ✅ Performance Testing
- [ ] Page load times acceptable (<3 seconds)
- [ ] Jobs load from Firebase successfully
- [ ] No console errors in browser
- [ ] Mobile responsiveness verified

### ✅ Monitoring Setup
- [ ] Vercel dashboard monitoring enabled
- [ ] Firebase usage tracking enabled
- [ ] Error logging reviewed

## Optimization Verification

### ✅ Cost Optimization Features
- [ ] Query caching working (5-minute staleTime)
- [ ] Pagination limiting Firebase reads (6 jobs per page)
- [ ] Server-side pagination implemented
- [ ] Production security rules active

### ✅ Expected Performance
- [ ] Firebase reads under control (monitored in console)
- [ ] Vercel bandwidth usage reasonable
- [ ] Page load performance optimized

## Success Criteria

### ✅ Deployment Successful When:
- [ ] All pages load without errors
- [ ] Jobs display correctly from Firebase
- [ ] Pagination works across all sections
- [ ] No console errors reported
- [ ] Mobile and desktop both functional
- [ ] Firebase costs remain minimal

## Rollback Plan

If deployment fails:
- [ ] Check Vercel function logs for errors
- [ ] Verify environment variables are correct
- [ ] Test Firebase connection from Vercel
- [ ] Revert to previous working version if needed

## Domain Configuration (Optional)

If using custom domain:
- [ ] Domain purchased and ready
- [ ] DNS configured for Vercel
- [ ] SSL certificate verified
- [ ] Custom domain tested

## Notes

- Initial deployment may take 5-10 minutes
- Check Vercel dashboard for real-time deployment status
- Firebase Firestore charges are per read/write operation
- Vercel free tier includes 100GB bandwidth monthly
- Production security rules are more restrictive than development
