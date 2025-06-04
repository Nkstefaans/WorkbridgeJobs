# WorkBridge Admin Panel

A web-based administration interface for managing jobs and applications in the WorkBridge Jobs platform.

## 🚀 Features

- **Job Management**
  - Post new job listings with rich details
  - View all posted jobs in a clean interface
  - Delete unwanted job postings
  - Real-time Firebase integration

- **Application Management**
  - View all job applications
  - See candidate details and cover letters
  - Access resume files
  - Track application dates

- **Firebase Integration**
  - Real-time connection status
  - Secure Firebase Firestore database
  - Automatic data synchronization
  - Error handling and validation

## 🛠️ Setup Instructions

### Prerequisites
- Node.js installed
- Firebase project configured (workbridge-273ad)
- Environment variables set up

### Quick Start

1. **Navigate to the admin directory:**
   ```bash
   cd admin
   ```

2. **Start the admin server:**
   ```bash
   node server.js
   ```

3. **Open the admin panel:**
   - Open your browser and go to: `http://localhost:3001`
   - The admin panel will load with Firebase connectivity

### Alternative: Direct File Access
You can also open `admin/index.html` directly in your browser, but using the server is recommended for better CORS handling.

## 📋 Usage Guide

### Posting Jobs

1. **Access the Post Job Tab** (default view)
2. **Fill in the job details:**
   - Job Title (required)
   - Company Name (required)
   - Location (required)
   - Job Type (required): Full-time, Part-time, Contract, Remote, Internship
   - Salary Range (optional): Minimum and maximum in ZAR
   - Company Logo URL (optional)
   - Required Skills (optional): Comma-separated list
   - Job Description (required): Detailed description

3. **Submit the job** by clicking "Post Job"
4. **Success confirmation** will appear, and the job will be added to Firebase

### Managing Jobs

1. **Click the "Manage Jobs" tab**
2. **View all posted jobs** with:
   - Job title and company
   - Location and job type
   - Salary information
   - Posted date
   - Required skills (first 5 shown)
   - Job description preview

3. **Available actions:**
   - **View Details**: See complete job information in a modal
   - **Delete Job**: Remove job posting (with confirmation)

### Viewing Applications

1. **Click the "Applications" tab**
2. **See all job applications** with:
   - Candidate name and contact information
   - Job applied for
   - Application date
   - Cover letter (if provided)
   - Resume file link (if provided)

3. **View full application details** by clicking the eye icon

## 🔧 Configuration

### Firebase Configuration
The admin panel uses the same Firebase configuration as the main application:

```javascript
// Firebase credentials are embedded in admin.js
const firebaseConfig = {
    apiKey: "AIzaSyB7tV28HxBcxU6nKMgqZpAe5RnyC-jvJU8",
    authDomain: "workbridge-273ad.firebaseapp.com",
    projectId: "workbridge-273ad",
    // ... other config
};
```

### Server Configuration
- **Default port**: 3001
- **Custom port**: Set `ADMIN_PORT` environment variable
- **CORS enabled** for development

## 🔒 Security Considerations

### Current Setup (Development)
- Firebase credentials are embedded in the client-side code
- No authentication required for admin access
- CORS headers allow all origins

### Production Recommendations
- Implement admin authentication (Firebase Auth)
- Move Firebase config to environment variables
- Add IP restrictions or VPN access
- Implement role-based access control
- Use HTTPS/SSL certificates

## 📁 File Structure

```
admin/
├── index.html          # Main admin interface
├── admin.js           # Firebase integration and functionality
├── server.js          # Local development server
├── README.md          # This file
└── package.json       # Admin-specific dependencies (if needed)
```

## 🌐 Firebase Collections

### Jobs Collection (`jobs`)
```javascript
{
  title: string,
  company: string,
  location: string,
  description: string,
  job_type: string,
  salary_min: number | null,
  salary_max: number | null,
  company_logo: string | null,
  skills: string[],
  posted_date: Timestamp
}
```

### Applications Collection (`applications`)
```javascript
{
  job_id: string,
  first_name: string,
  last_name: string,
  email: string,
  phone: string | null,
  cover_letter: string | null,
  resume_file: string | null,
  applied_date: Timestamp
}
```

## 🚨 Troubleshooting

### Connection Issues
- **Red connection status**: Check Firebase configuration
- **Permission denied**: Update Firestore security rules
- **Network errors**: Verify internet connection

### Common Errors
- **"Missing required fields"**: Fill in all required form fields
- **"Failed to post job"**: Check browser console for detailed errors
- **"Failed to load jobs"**: Verify Firebase permissions

### Firebase Console Access
- Project: https://console.firebase.google.com/project/workbridge-273ad
- Firestore: https://console.firebase.google.com/project/workbridge-273ad/firestore
- Security Rules: https://console.firebase.google.com/project/workbridge-273ad/firestore/rules

## 🔄 Development vs Production

### Development (Current)
- Local server on port 3001
- Embedded Firebase credentials
- No authentication required
- Full admin access

### Production (Recommended)
- Deploy to Firebase Hosting with custom subdomain
- Environment-based configuration
- Admin authentication with Firebase Auth
- Role-based permissions
- HTTPS/SSL encryption

## 📞 Support

For issues with the admin panel:
1. Check the browser console for error messages
2. Verify Firebase connectivity in the admin panel header
3. Ensure Firestore security rules allow admin operations
4. Test with the main WorkBridge application to verify Firebase setup

## 🎯 Future Enhancements

- **Authentication**: Admin login system
- **Analytics**: Job posting and application statistics
- **Bulk Operations**: Multiple job management
- **Email Integration**: Notify candidates
- **Advanced Filtering**: Search and filter capabilities
- **Responsive Design**: Mobile-friendly interface
- **File Upload**: Direct resume and logo uploads
- **Rich Text Editor**: Enhanced job description editing
