import { VercelRequest, VercelResponse } from '@vercel/node';

// Set CORS headers
function setCORS(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
}

// Initialize Firebase and get jobs
async function getJobsFromFirebase(page = 1, limit = 6, category?: string) {
  try {
    // Dynamic imports to avoid initialization issues
    const { initializeApp } = await import('firebase/app');
    const { getFirestore, collection, getDocs, query, orderBy, startAt, limit: firestoreLimit } = await import('firebase/firestore');
    
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    let jobQuery = query(
      collection(db, 'jobs'),
      orderBy('posted_date', 'desc'),
      firestoreLimit(limit)
    );

    if (page > 1) {
      const offset = (page - 1) * limit;
      jobQuery = query(
        collection(db, 'jobs'),
        orderBy('posted_date', 'desc'),
        startAt(offset),
        firestoreLimit(limit)
      );
    }

    const snapshot = await getDocs(jobQuery);
    const jobs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

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

  try {
    // Debug endpoint
    if (urlPath.endsWith('/debug')) {
      return res.json({
        nodeEnv: process.env.NODE_ENV,
        hasFirebaseApiKey: !!process.env.FIREBASE_API_KEY,
        hasFirebaseProjectId: !!process.env.FIREBASE_PROJECT_ID,
        firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
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
