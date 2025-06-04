// Quick Firebase connectivity test
import 'dotenv/config';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './server/firebase.js';

async function testFirebaseConnection() {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Try to read from jobs collection
    const jobsCollection = collection(db, 'jobs');
    const snapshot = await getDocs(jobsCollection);
    console.log('✅ Read test successful - Found', snapshot.size, 'documents');
    
    // Try to write a test document
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Firebase connection test'
    };
    
    await addDoc(collection(db, 'test'), testDoc);
    console.log('✅ Write test successful');
    
    console.log('🎉 Firebase is working correctly!');
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    console.log('\n🔧 To fix this:');
    console.log('1. Go to Firebase Console > Firestore Database > Rules');
    console.log('2. Set rules to allow read/write for development');
    console.log('3. Ensure Firestore database is created');
    process.exit(1);
  }
}

testFirebaseConnection();
