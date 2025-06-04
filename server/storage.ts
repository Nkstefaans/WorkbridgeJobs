import { jobs, applications, type Job, type Application, type InsertJob, type InsertApplication } from "@shared/schema";

export interface IStorage {
  // Job methods
  getJobs(): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  searchJobs(query?: string, location?: string, jobType?: string): Promise<Job[]>;
  
  // Application methods
  getApplications(): Promise<Application[]>;
  getApplicationsByJobId(jobId: number): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
}

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
    const initialJobs: InsertJob[] = [
      {
        title: "Senior Software Engineer",
        company: "TechCorp Solutions",
        location: "San Francisco, CA",
        description: "Join our innovative team to build scalable web applications using React, Node.js, and cloud technologies. We're looking for passionate developers who love solving complex problems and working in a collaborative environment.",
        salary_min: 120000,
        salary_max: 180000,
        job_type: "Full-time",
        skills: ["React", "Node.js", "AWS", "TypeScript", "PostgreSQL"],
        company_logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
      },
      {
        title: "UX/UI Designer",
        company: "Creative Design Studio",
        location: "New York, NY",
        description: "Create intuitive user experiences for our digital products. Work with cross-functional teams to translate business requirements into beautiful, functional designs that delight our users.",
        salary_min: 80000,
        salary_max: 120000,
        job_type: "Full-time",
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
        company_logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
      },
      {
        title: "Data Scientist",
        company: "DataFlow Analytics",
        location: "Remote",
        description: "Analyze large datasets to extract meaningful insights and drive business decisions. Experience with Python, R, and machine learning algorithms required. Work with cutting-edge data technologies.",
        salary_min: 100000,
        salary_max: 150000,
        job_type: "Remote",
        skills: ["Python", "R", "Machine Learning", "SQL", "Tableau"],
        company_logo: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
      },
      {
        title: "Marketing Manager",
        company: "Growth Marketing Pro",
        location: "Austin, TX",
        description: "Lead marketing campaigns and drive customer acquisition. Experience with digital marketing, content strategy, and analytics required. Help us scale our marketing efforts and build our brand.",
        salary_min: 70000,
        salary_max: 95000,
        job_type: "Full-time",
        skills: ["Digital Marketing", "Analytics", "SEO", "Content Strategy"],
        company_logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
      },
      // Government positions
      {
        title: "Federal IT Specialist",
        company: "Department of Technology",
        location: "Washington, DC",
        description: "Support government technology infrastructure and digital transformation initiatives. Work on modernizing federal systems and ensuring cybersecurity compliance across government agencies.",
        salary_min: 85000,
        salary_max: 120000,
        job_type: "Full-time",
        skills: ["Government Security", "Network Administration", "Compliance", "Project Management"],
        company_logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
      },
      {
        title: "Policy Analyst",
        company: "State Government Affairs",
        location: "Sacramento, CA",
        description: "Research and analyze policy proposals, prepare briefing materials, and support legislative processes. Collaborate with stakeholders to develop effective public policy solutions.",
        salary_min: 65000,
        salary_max: 85000,
        job_type: "Full-time",
        skills: ["Policy Research", "Data Analysis", "Public Administration", "Report Writing"],
        company_logo: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
      },
      // Municipal positions
      {
        title: "City Planning Coordinator",
        company: "City of Portland",
        location: "Portland, OR",
        description: "Support urban planning initiatives and community development projects. Review development proposals, conduct site visits, and facilitate public engagement in municipal planning processes.",
        salary_min: 60000,
        salary_max: 80000,
        job_type: "Full-time",
        skills: ["Urban Planning", "GIS", "Community Engagement", "Project Coordination"],
        company_logo: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
      },
      {
        title: "Municipal Engineer",
        company: "City Public Works Department",
        location: "Denver, CO",
        description: "Design and oversee municipal infrastructure projects including roads, water systems, and public facilities. Ensure compliance with safety standards and environmental regulations.",
        salary_min: 75000,
        salary_max: 105000,
        job_type: "Full-time",
        skills: ["Civil Engineering", "CAD", "Project Management", "Municipal Infrastructure"],
        company_logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
      },
      // Retail positions
      {
        title: "Store Manager",
        company: "Downtown Retail Store",
        location: "Chicago, IL",
        description: "Lead daily retail operations, manage staff, and drive sales performance. Create exceptional customer service experiences and ensure store compliance with company standards.",
        salary_min: 45000,
        salary_max: 65000,
        job_type: "Full-time",
        skills: ["Retail Management", "Customer Service", "Team Leadership", "Sales"],
        company_logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
      },
      {
        title: "Sales Associate",
        company: "Fashion Retail Chain",
        location: "Miami, FL",
        description: "Provide excellent customer service, assist with product selection, and maintain store presentation. Work in a fast-paced retail environment with opportunities for advancement.",
        salary_min: 28000,
        salary_max: 35000,
        job_type: "Part-time",
        skills: ["Customer Service", "Sales", "Product Knowledge", "Cash Handling"],
        company_logo: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
      }
    ];

    initialJobs.forEach(job => {
      this.createJob(job);
    });
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
      posted_date: new Date(),
    };
    this.jobs.set(id, job);
    return job;
  }

  async searchJobs(query?: string, location?: string, jobType?: string): Promise<Job[]> {
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

    return jobs.sort((a, b) => 
      new Date(b.posted_date || 0).getTime() - new Date(a.posted_date || 0).getTime()
    );
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
      applied_date: new Date(),
    };
    this.applications.set(id, application);
    return application;
  }
}

export const storage = new MemStorage();
