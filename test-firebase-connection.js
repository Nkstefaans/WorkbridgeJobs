// Test Firebase Connection
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';

// Your Firebase configuration
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
const db = getFirestore(app);

async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase connection...');
  
  try {
    // Test reading from jobs collection
    console.log('📖 Attempting to read jobs...');
    const jobsCollection = collection(db, 'jobs');
    const querySnapshot = await getDocs(jobsCollection);
    
    console.log(`✅ Successfully read ${querySnapshot.size} jobs from Firestore!`);
    
    // List all jobs
    querySnapshot.forEach((doc) => {
      console.log(`   - Job ID: ${doc.id}`);
      console.log(`     Title: ${doc.data().title}`);
      console.log(`     Company: ${doc.data().company}`);
      console.log('---');
    });
    
    // Test writing to jobs collection
    console.log('✍️ Testing job creation...');
    const testJob = {
      title: "Test Job - Firebase Connection",
      company: "Test Company",
      location: "Johannesburg, South Africa",
      description: "This is a test job to verify Firebase connection",
      salary_min: 25000,
      salary_max: 35000,
      job_type: "Full-time",
      skills: ["Testing", "Firebase"],
      company_logo: "https://via.placeholder.com/60",
      created_date: new Date()
    };
    
    const docRef = await addDoc(jobsCollection, testJob);
    console.log(`✅ Test job created with ID: ${docRef.id}`);
    
    console.log('🎉 Firebase connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Firebase connection test failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      console.error('');
      console.error('🚨 PERMISSION DENIED ERROR:');
      console.error('   1. Go to: https://console.firebase.google.com/project/workbridge-273ad/firestore/rules');
      console.error('   2. Replace the rules with the development rules');
      console.error('   3. Click "Publish"');
      console.error('   4. Wait 30 seconds and try again');
    }
  }
}

testFirebaseConnection();
