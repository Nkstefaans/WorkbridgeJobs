# 🚨 URGENT: Fix Firebase Permissions

## Problem
Your app is getting "permission-denied" errors from Firebase because the Firestore security rules are blocking access.

## Quick Fix (5 minutes)

### Step 1: Open Firebase Console
Go to: https://console.firebase.google.com/project/workbridge-273ad/firestore/rules

### Step 2: Replace Security Rules
Replace the current rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access on all documents (DEVELOPMENT ONLY)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Step 3: Publish
Click the "Publish" button and wait 10-20 seconds for deployment.

### Step 4: Test
Restart your server:
```cmd
npm run dev
```

You should see:
- ✅ Firebase: Initial job data seeded successfully
- No more permission-denied errors

## Why This Happened
- Firebase Firestore has security rules that block unauthorized access by default
- Your rules were too restrictive for development
- The rules above allow full access for development (change for production!)

## Production Note
Before going live, implement proper authentication and restrictive rules.
