import { type Application, type InsertApplication, type InsertJob, type Job } from "@shared/schema";
import {
    addDoc,
    collection,
    DocumentData,
    query as firestoreQuery,
    getDocs,
    orderBy,
    QueryDocumentSnapshot,
    Timestamp,
    where
} from 'firebase/firestore';
import { db } from './firebase.js';
import type { IStorage } from './storage.js';

export class FirebaseStorage implements IStorage {
  private jobsCollection = collection(db, 'jobs');
  private applicationsCollection = collection(db, 'applications');

  constructor() {
    // Initialize with sample data if needed
    this.seedInitialData();
  }

  private async seedInitialData() {
    try {
      // Check if we already have jobs
      const jobsQuery = firestoreQuery(this.jobsCollection);
      const jobsSnapshot = await getDocs(jobsQuery);
      
      if (jobsSnapshot.empty) {
        // Add the City of Tshwane driver position
        const tshwaneDriverJob: InsertJob = {
          title: "Driver - Mobile Healthcare Clinic (Contract Position)",
          company: "City of Tshwane Metropolitan Municipality",
          location: "Olievenhoutbosch, Tshwane, South Africa",
          description: "Reference Code: 85DE357-2025 (E)\nClosing Date: 10.06.2025\n\nDRIVER (ONE CONTRACT POSITION: OLIEVENHOUTBOSCH PRIMARY HEALTHCARE MOBILE CLINIC) - 12-MONTH PERIOD\n\nDepartment: Health, Division: General, Sub-Division: Administration\nLocation: Olievenhoutbosch (or as indicated by the Health Department)\n\nPOSITION OVERVIEW:\nThe Driver will be responsible for driving the mobile clinic to dedicated areas in the informal settlements of the Olievenhoutbosch area.\n\nMINIMUM REQUIREMENTS:\n• Grade 10 or equivalent qualification\n• Relevant experience in administrative support services\n• Computer literacy\n• Valid EC1 or EC driving licence with a valid professional driving permit\n• Must undergo a criminal record check and fingerprints to be taken by the Tshwane Metro Police Department at own cost\n\nPERSONAL ATTRIBUTES/COMPETENCIES:\n• Honesty, patience, good driving behaviour\n• Good communication skills\n• Good presentation skills\n• Good negotiation skills\n\nPRIMARY FUNCTIONS:\n• Preparing the vehicle by conducting pre-trip operator maintenance\n• Planning the route and requirements by studying the schedule or responding to ad hoc requests by the office\n• Transporting mobile clinic staff\n• Maintaining vehicles (daily maintenance, fuel checks, log sheets, reporting problems)\n• Keeping vehicles clean and tidy\n• Performing any other tasks as assigned\n\nSALARY SCALE: R17,787.00 per month (fixed)\nJOB LEVEL: T6\nENQUIRIES: Ms Nadine Roberts (012 358 8644)",
          salary_min: 213444,
          salary_max: 213444,
          job_type: "Contract",
          skills: ["EC1 Driving Licence", "Professional Driving Permit", "Vehicle Maintenance", "Healthcare Support", "Administrative Support", "Computer Literacy", "Route Planning"],
          company_logo: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
        };

        await this.createJob(tshwaneDriverJob);
        console.log('✅ Firebase: Initial job data seeded successfully');
      }
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.error('🚨 FIREBASE PERMISSION DENIED: Please update Firestore security rules in Firebase Console');
        console.error('   Go to: https://console.firebase.google.com/project/workbridge-273ad/firestore/rules');
        console.error('   Copy rules from: firestore-dev.rules file');
      } else {
        console.error('❌ Firebase: Error seeding initial data:', error);
      }
    }
  }

  private convertFirestoreDoc(doc: QueryDocumentSnapshot<DocumentData>): Job {
    const data = doc.data();
    return {
      id: parseInt(doc.id) || Math.floor(Math.random() * 1000000), // Generate ID if needed
      title: data.title,
      company: data.company,
      location: data.location,
      description: data.description,
      salary_min: data.salary_min ?? null,
      salary_max: data.salary_max ?? null,
      job_type: data.job_type,
      skills: data.skills ?? null,
      posted_date: data.posted_date?.toDate() ?? null,
      company_logo: data.company_logo ?? null,
    };
  }

  private convertFirestoreApplication(doc: QueryDocumentSnapshot<DocumentData>): Application {
    const data = doc.data();
    return {
      id: parseInt(doc.id) || Math.floor(Math.random() * 1000000),
      job_id: data.job_id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone ?? null,
      cover_letter: data.cover_letter ?? null,
      resume_file: data.resume_file ?? null,
      applied_date: data.applied_date?.toDate() ?? null,
    };
  }

  async getJobs(): Promise<Job[]> {
    try {
      const jobsQuery = firestoreQuery(this.jobsCollection, orderBy('posted_date', 'desc'));
      const snapshot = await getDocs(jobsQuery);
      return snapshot.docs.map(doc => this.convertFirestoreDoc(doc));
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.error('🚨 FIREBASE PERMISSION DENIED: Please update Firestore security rules');
        console.error('   Go to: https://console.firebase.google.com/project/workbridge-273ad/firestore/rules');
      } else {
        console.error('❌ Firebase: Error getting jobs:', error);
      }
      return [];
    }
  }

  async getJob(id: number): Promise<Job | undefined> {
    try {
      // Since Firestore uses string IDs, we need to query by the numeric ID field
      const jobsQuery = firestoreQuery(this.jobsCollection, where('id', '==', id));
      const snapshot = await getDocs(jobsQuery);
      
      if (!snapshot.empty) {
        return this.convertFirestoreDoc(snapshot.docs[0]);
      }
      return undefined;
    } catch (error) {
      console.error('❌ Firebase: Error getting job:', error);
      return undefined;
    }
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    try {
      const jobData = {
        ...insertJob,
        id: Math.floor(Math.random() * 1000000), // Generate unique ID
        posted_date: Timestamp.now(),
      };

      const docRef = await addDoc(this.jobsCollection, jobData);
      
      return {
        ...jobData,
        salary_min: jobData.salary_min ?? null,
        salary_max: jobData.salary_max ?? null,
        skills: jobData.skills ?? null,
        company_logo: jobData.company_logo ?? null,
        posted_date: new Date(),
      };
    } catch (error) {
      console.error('❌ Firebase: Error creating job:', error);
      throw error;
    }
  }

  async searchJobs(query?: string, location?: string, jobType?: string): Promise<Job[]> {
    try {
      let jobsQuery = firestoreQuery(this.jobsCollection, orderBy('posted_date', 'desc'));
      
      // Note: Firestore has limited text search capabilities
      // For production, consider using Algolia or Elasticsearch for better search
      if (jobType) {
        jobsQuery = firestoreQuery(this.jobsCollection, where('job_type', '==', jobType), orderBy('posted_date', 'desc'));
      }

      const snapshot = await getDocs(jobsQuery);
      let jobs = snapshot.docs.map(doc => this.convertFirestoreDoc(doc));

      // Client-side filtering for text search (not ideal for large datasets)
      if (query) {
        const searchTerm = query.toLowerCase();
        jobs = jobs.filter(job => 
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm) ||
          job.skills?.some(skill => skill.toLowerCase().includes(searchTerm))
        );
      }

      if (location) {
        const locationTerm = location.toLowerCase();
        jobs = jobs.filter(job => 
          job.location.toLowerCase().includes(locationTerm)
        );
      }

      return jobs;
    } catch (error) {
      console.error('❌ Firebase: Error searching jobs:', error);
      return [];
    }
  }

  async getApplications(): Promise<Application[]> {
    try {
      const applicationsQuery = firestoreQuery(this.applicationsCollection, orderBy('applied_date', 'desc'));
      const snapshot = await getDocs(applicationsQuery);
      return snapshot.docs.map(doc => this.convertFirestoreApplication(doc));
    } catch (error) {
      console.error('❌ Firebase: Error getting applications:', error);
      return [];
    }
  }

  async getApplicationsByJobId(jobId: number): Promise<Application[]> {
    try {
      const applicationsQuery = firestoreQuery(
        this.applicationsCollection, 
        where('job_id', '==', jobId),
        orderBy('applied_date', 'desc')
      );
      const snapshot = await getDocs(applicationsQuery);
      return snapshot.docs.map(doc => this.convertFirestoreApplication(doc));
    } catch (error) {
      console.error('❌ Firebase: Error getting applications by job ID:', error);
      return [];
    }
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    try {
      const applicationData = {
        ...insertApplication,
        id: Math.floor(Math.random() * 1000000), // Generate unique ID
        applied_date: Timestamp.now(),
      };

      const docRef = await addDoc(this.applicationsCollection, applicationData);
      
      return {
        ...applicationData,
        phone: applicationData.phone ?? null,
        cover_letter: applicationData.cover_letter ?? null,
        resume_file: applicationData.resume_file ?? null,
        applied_date: new Date(),
      };
    } catch (error) {
      console.error('❌ Firebase: Error creating application:', error);
      throw error;
    }
  }
}
