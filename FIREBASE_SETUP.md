# Firebase Setup Guide for WorkBridge Jobs

## ✅ Your Firebase Project is Already Configured!

Your Firebase credentials have been securely set up with environment variables. The project is configured to use:
- **Project ID**: workbridge-273ad
- **Project Name**: WorkBridge Jobs Platform

## 🔐 Security Setup

### 1. Environment Variables
Your Firebase credentials are stored in `.env` file (which is git-ignored for security):
```bash
FIREBASE_API_KEY=AIzaSyB7tV28HxBcxU6nKMgqZpAe5RnyC-jvJU8
FIREBASE_AUTH_DOMAIN=workbridge-273ad.firebaseapp.com
FIREBASE_PROJECT_ID=workbridge-273ad
# ... other credentials
```

### 2. Firestore Security Rules
Apply the security rules from `firestore.rules` to your Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **workbridge-273ad**
3. Navigate to **Firestore Database** > **Rules**
4. Copy the rules from `firestore.rules` file
5. Click **Publish**

## 🚀 Next Steps

### 1. Enable Firestore Database
1. Go to Firebase Console > **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select your preferred location (closest to your users)

### 2. Test the Integration
Run your development server:
```bash
npm run dev
```

### 3. Verify Data Storage
1. Create a job posting through your app
2. Check Firebase Console > Firestore Database > Data
3. You should see collections: `jobs` and `applications`

### 📊 Firebase Console Features

Once set up, you can:
- View all jobs in real-time in Firebase Console
- See applications as they come in
- Manually add/edit jobs through the web interface
- Monitor usage and performance
- Export data for analytics

## 🚨 URGENT: Fix Permission Denied Errors

If you're seeing "Missing or insufficient permissions" errors, follow these steps:

### 1. Apply Development Security Rules
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **workbridge-273ad**
3. Go to **Firestore Database** > **Rules**
4. Replace with this DEVELOPMENT rule:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
5. Click **Publish**

### 2. Ensure Firestore is Created
1. In Firebase Console, go to **Firestore Database**
2. If you see "Create database", click it
3. Choose **"Start in test mode"**
4. Select location (closest to South Africa)
5. Click **Done**

### 🎉 Ready to Go!

After completing the setup steps above, your WorkBridge Jobs platform will have enterprise-grade data storage with Google Firebase!
