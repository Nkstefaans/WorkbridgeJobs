import { type Application, type InsertApplication, type InsertJob, type Job } from "@shared/schema";
import { FirebaseStorage } from "./firebaseStorage.js";

export interface IStorage {
  // Job methods
  getJobs(): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  searchJobs(query?: string, location?: string, jobType?: string, page?: number, limit?: number): Promise<Job[]>;
  
  // Application methods
  getApplications(): Promise<Application[]>;
  getApplicationsByJobId(jobId: number): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
}

// Legacy MemStorage class (keeping for fallback)
export class MemStorage implements IStorage {
  private jobs: Map<number, Job>;
  private applications: Map<number, Application>;
  private currentJobId: number;
  private currentApplicationId: number;

  constructor() {
    this.jobs = new Map();
    this.applications = new Map();
    this.currentJobId = 1;
    this.currentApplicationId = 1;
    
    // Add some initial jobs for testing
    this.seedInitialData();
  }

  private seedInitialData() {
    // Add the City of Tshwane driver position
    const tshwaneDriverJob: InsertJob = {
      title: "Driver - Mobile Healthcare Clinic (Contract Position)",
      company: "City of Tshwane Metropolitan Municipality",
      location: "Olievenhoutbosch, Tshwane, South Africa",
      description: "Reference Code: 85DE357-2025 (E)\nClosing Date: 10.06.2025\n\nDRIVER (ONE CONTRACT POSITION: OLIEVENHOUTBOSCH PRIMARY HEALTHCARE MOBILE CLINIC) - 12-MONTH PERIOD\n\nDepartment: Health, Division: General, Sub-Division: Administration\nLocation: Olievenhoutbosch (or as indicated by the Health Department)\n\nPOSITION OVERVIEW:\nThe Driver will be responsible for driving the mobile clinic to dedicated areas in the informal settlements of the Olievenhoutbosch area.\n\nMINIMUM REQUIREMENTS:\n• Grade 10 or equivalent qualification\n• Relevant experience in administrative support services\n• Computer literacy\n• Valid EC1 or EC driving licence with a valid professional driving permit\n• Must undergo a criminal record check and fingerprints to be taken by the Tshwane Metro Police Department at own cost\n\nPERSONAL ATTRIBUTES/COMPETENCIES:\n• Honesty, patience, good driving behaviour\n• Good communication skills\n• Good presentation skills\n• Good negotiation skills\n\nPRIMARY FUNCTIONS:\n• Preparing the vehicle by conducting pre-trip operator maintenance\n• Planning the route and requirements by studying the schedule or responding to ad hoc requests by the office\n• Transporting mobile clinic staff\n• Maintaining vehicles (daily maintenance, fuel checks, log sheets, reporting problems)\n• Keeping vehicles clean and tidy\n• Performing any other tasks as assigned\n\nSALARY SCALE: R17,787.00 per month (fixed)\nJOB LEVEL: T6\nENQUIRIES: Ms Nadine Roberts (012 358 8644)",
      salary_min: 187000,
      salary_max: 213444,
      job_type: "Contract",
      skills: ["EC1 Driving Licence", "Professional Driving Permit", "Vehicle Maintenance", "Healthcare Support", "Administrative Support", "Computer Literacy", "Route Planning"],
      company_logo: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
    };

    this.createJob(tshwaneDriverJob);
  }

  async getJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values()).sort((a, b) => 
      new Date(b.posted_date || 0).getTime() - new Date(a.posted_date || 0).getTime()
    );
  }

  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.currentJobId++;
    const job: Job = {
      ...insertJob,
      id,
      salary_min: insertJob.salary_min ?? null,
      salary_max: insertJob.salary_max ?? null,
      skills: insertJob.skills ?? null,
      company_logo: insertJob.company_logo ?? null,
      posted_date: new Date(),
    };
    this.jobs.set(id, job);
    return job;
  }
  async searchJobs(query?: string, location?: string, jobType?: string, page = 1, limit = 10): Promise<Job[]> {
    let jobs = Array.from(this.jobs.values());

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

    if (jobType) {
      jobs = jobs.filter(job => job.job_type === jobType);
    }

    // Sort by posted date
    jobs = jobs.sort((a, b) => 
      new Date(b.posted_date || 0).getTime() - new Date(a.posted_date || 0).getTime()
    );

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return jobs.slice(startIndex, endIndex);
  }

  async getApplications(): Promise<Application[]> {
    return Array.from(this.applications.values()).sort((a, b) => 
      new Date(b.applied_date || 0).getTime() - new Date(a.applied_date || 0).getTime()
    );
  }

  async getApplicationsByJobId(jobId: number): Promise<Application[]> {
    return Array.from(this.applications.values())
      .filter(app => app.job_id === jobId)
      .sort((a, b) => 
        new Date(b.applied_date || 0).getTime() - new Date(a.applied_date || 0).getTime()
      );
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.currentApplicationId++;
    const application: Application = {
      ...insertApplication,
      id,
      phone: insertApplication.phone ?? null,
      cover_letter: insertApplication.cover_letter ?? null,
      resume_file: insertApplication.resume_file ?? null,
      applied_date: new Date(),
    };
    this.applications.set(id, application);
    return application;
  }
}

// Use Firebase storage directly
console.log('🔥 Initializing Firebase Storage...');
export const storage: IStorage = new FirebaseStorage();
