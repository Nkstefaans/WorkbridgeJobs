import { VercelRequest, VercelResponse } from '@vercel/node';

// Set CORS headers
function setCORS(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
}

// Global Firebase app instance
let firebaseApp: any = null;
let firestoreDb: any = null;

// Initialize Firebase once
async function initializeFirebase() {
  if (firebaseApp && firestoreDb) {
    return { app: firebaseApp, db: firestoreDb };
  }

  try {
    const { initializeApp, getApps } = await import('firebase/app');
    const { getFirestore, connectFirestoreEmulator } = await import('firebase/firestore');
    
    // Check if Firebase is already initialized
    const existingApps = getApps();
    if (existingApps.length > 0) {
      firebaseApp = existingApps[0];
    } else {
      const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      };

      console.log('Initializing Firebase with config:', {
        projectId: firebaseConfig.projectId,
        hasApiKey: !!firebaseConfig.apiKey,
        hasAuthDomain: !!firebaseConfig.authDomain,
      });

      firebaseApp = initializeApp(firebaseConfig);
    }

    firestoreDb = getFirestore(firebaseApp);
    
    return { app: firebaseApp, db: firestoreDb };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

// Get jobs from Firebase
async function getJobsFromFirebase(page = 1, limit = 6, category?: string) {
  try {
    const { db } = await initializeFirebase();
    const { collection, getDocs, query, orderBy, limit: firestoreLimit } = await import('firebase/firestore');    
    // Create a simple query without pagination for now to avoid errors
    const jobQuery = query(
      collection(db, 'jobs'),
      orderBy('posted_date', 'desc'),
      firestoreLimit(limit * page) // Get more data and slice it
    );

    const snapshot = await getDocs(jobQuery);
    let jobs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Manual pagination - skip the first (page-1) * limit items
    if (page > 1) {
      const startIndex = (page - 1) * limit;
      jobs = jobs.slice(startIndex, startIndex + limit);
    } else {
      jobs = jobs.slice(0, limit);
    }

    // Filter by category if specified
    if (category && category !== 'all') {
      return jobs.filter(job => 
        job.category?.toLowerCase() === category.toLowerCase() ||
        job.company?.toLowerCase().includes(category.toLowerCase())
      );
    }

    return jobs;
  } catch (error) {
    console.error('Firebase error:', error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCORS(res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req;
  const urlPath = url?.split('?')[0] || '';

  try {    // Debug endpoint
    if (urlPath.endsWith('/debug')) {
      return res.json({
        nodeEnv: process.env.NODE_ENV,
        hasFirebaseApiKey: !!process.env.FIREBASE_API_KEY,
        hasFirebaseProjectId: !!process.env.FIREBASE_PROJECT_ID,
        firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
        firebaseApiKeyLength: process.env.FIREBASE_API_KEY?.length || 0,
        firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
        allEnvVars: Object.keys(process.env).filter(key => key.startsWith('FIREBASE_')),
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method
      });
    }

    // Health check endpoint
    if (urlPath.endsWith('/health')) {
      return res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      });
    }

    // Jobs endpoint
    if (urlPath.endsWith('/jobs') || urlPath.includes('/jobs/')) {
      const urlParams = new URLSearchParams(url?.split('?')[1] || '');
      const page = parseInt(urlParams.get('page') || '1');
      const limit = parseInt(urlParams.get('limit') || '6');
      const category = urlParams.get('category') || undefined;

      console.log('Fetching jobs:', { page, limit, category });
      
      const jobs = await getJobsFromFirebase(page, limit, category);
      
      return res.json(jobs);
    }

    // Firebase test endpoint
    if (urlPath.endsWith('/test-firebase')) {
      const jobs = await getJobsFromFirebase(1, 3);
      return res.json({
        success: true,
        jobCount: jobs.length,
        sampleJobs: jobs.slice(0, 2),
        timestamp: new Date().toISOString()
      });
    }

    // Default 404
    return res.status(404).json({ 
      message: 'Endpoint not found',
      path: urlPath,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error',
      timestamp: new Date().toISOString()
    });
  }
}
