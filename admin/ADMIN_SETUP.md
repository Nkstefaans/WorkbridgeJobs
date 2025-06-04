# WorkBridge Admin Configuration

## Admin Email Setup

To configure which email addresses can access the admin panel, edit the `ADMIN_EMAILS` array in `admin.js`:

```javascript
// ADMIN CONFIGURATION - Add your email address here
const ADMIN_EMAILS = [
    'your-admin-email@example.com'  // Replace with your actual email address
];
```

## Steps to Set Up Admin Access:

### 1. Add Your Email to the Whitelist
1. Open `admin/admin.js`
2. Find the `ADMIN_EMAILS` array (around line 40)
3. Replace `'your-admin-email@example.com'` with your actual email address
4. Save the file

### 2. Create a Firebase Auth Account
1. Go to [Firebase Console](https://console.firebase.google.com/project/workbridge-273ad/authentication/users)
2. Click on "Authentication" → "Users"
3. Click "Add user"
4. Enter your email address and create a password
5. Click "Add user"

### 3. Enable Email/Password Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Click on "Email/Password"
3. Enable the first toggle (Email/Password)
4. Click "Save"

### 4. Test Access
1. Start the admin server: `npm run admin`
2. Open `http://localhost:3001`
3. Enter your email and password
4. You should be able to access the admin panel

## Security Features:

- ✅ **Email Whitelist**: Only specified emails can access the admin panel
- ✅ **Firebase Authentication**: Secure login with Firebase Auth
- ✅ **Session Management**: Automatic login persistence
- ✅ **Unauthorized Access Prevention**: Non-whitelisted users are denied access
- ✅ **Secure Logout**: Proper session termination

## Adding More Admins:

To add additional administrators:

```javascript
const ADMIN_EMAILS = [
    'your-email@example.com',
    'another-admin@example.com',
    'third-admin@example.com'
];
```

Remember to create Firebase Auth accounts for each admin email.

## Troubleshooting:

### "Access denied" message:
- Check that your email is correctly added to the `ADMIN_EMAILS` array
- Ensure there are no typos in the email address
- Make sure the email matches exactly (case-sensitive)

### "No account found" error:
- Create the user account in Firebase Console
- Ensure Email/Password authentication is enabled

### "Authentication failed" errors:
- Check your password is correct
- Verify your internet connection
- Check Firebase Console for any project issues

## Production Recommendations:

For production deployment:
- Move admin emails to environment variables
- Use stronger passwords
- Enable 2FA if available
- Consider IP restrictions
- Use HTTPS only
- Regular security audits
