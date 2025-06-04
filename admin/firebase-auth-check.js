// Firebase Authentication Diagnostic Script
// Run this with: node admin/firebase-auth-check.js

import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB7tV28HxBcxU6nKMgqZpAe5RnyC-jvJU8",
    authDomain: "workbridge-273ad.firebaseapp.com",
    projectId: "workbridge-273ad",
    storageBucket: "workbridge-273ad.firebasestorage.app",
    messagingSenderId: "1092375078581",
    appId: "1:1092375078581:web:9d9c4d58996ede2da7c0fc",
    measurementId: "G-T8DZ5Z73Z9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const adminEmail = 'nkstefaans1@gmail.com';
const testPassword = 'workbridge2024'; // You should use a proper password

async function checkFirebaseAuth() {
    console.log('🔍 Checking Firebase Authentication setup...\n');
    
    try {
        console.log('1. Testing Firebase connection...');
        console.log('   Project ID:', firebaseConfig.projectId);
        console.log('   Auth Domain:', firebaseConfig.authDomain);
        console.log('   ✅ Firebase config loaded successfully\n');
        
        console.log('2. Testing user account creation...');
        try {
            // Try to create the user account
            const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, testPassword);
            console.log('   ✅ User account created successfully!');
            console.log('   User UID:', userCredential.user.uid);
            console.log('   Email:', userCredential.user.email);
            console.log('   Email Verified:', userCredential.user.emailVerified);
        } catch (createError) {
            if (createError.code === 'auth/email-already-in-use') {
                console.log('   ℹ️ User account already exists (this is good!)');
                
                // Try to sign in with existing account
                console.log('\n3. Testing sign-in with existing account...');
                try {
                    const signInCredential = await signInWithEmailAndPassword(auth, adminEmail, testPassword);
                    console.log('   ✅ Sign-in successful!');
                    console.log('   User UID:', signInCredential.user.uid);
                    console.log('   Last Sign In:', signInCredential.user.metadata.lastSignInTime);
                } catch (signInError) {
                    console.log('   ❌ Sign-in failed:', signInError.code, '-', signInError.message);
                    console.log('   💡 You may need to use a different password or reset it');
                }
            } else {
                console.log('   ❌ Account creation failed:', createError.code, '-', createError.message);
                
                if (createError.code === 'auth/operation-not-allowed') {
                    console.log('   💡 Email/Password authentication is not enabled in Firebase Console');
                    console.log('   📝 To fix: Go to Firebase Console > Authentication > Sign-in method > Email/Password > Enable');
                }
            }
        }
        
    } catch (error) {
        console.log('❌ Firebase connection failed:', error.message);
        
        if (error.code === 'auth/invalid-api-key') {
            console.log('💡 Invalid API key - check your Firebase configuration');
        } else if (error.code === 'auth/network-request-failed') {
            console.log('💡 Network error - check your internet connection');
        }
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
    console.log('2. Select project: workbridge-273ad');
    console.log('3. Go to Authentication > Sign-in method');
    console.log('4. Enable Email/Password provider');
    console.log('5. If user creation failed, manually create user account in Firebase Console');
    
    process.exit(0);
}

checkFirebaseAuth().catch(console.error);
