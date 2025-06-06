import { ApplicationModal } from "@/components/ApplicationModal";
import { CookieConsent } from "@/components/CookieConsent";
import { EnhancedJobCard } from "@/components/EnhancedJobCard";
import { EnhancedSearchBar } from "@/components/EnhancedSearchBar";
import {
    EnhancedJobCardSkeleton,
    MobileJobCardSkeleton
} from "@/components/EnhancedSkeletons";
import { HeaderBannerAd, InContentAd, MobileStickyAd, SidebarAd } from "@/components/GoogleAds";
import { JobDetailsModal } from "@/components/JobDetailsModal";
import { JobFilters } from "@/components/JobFilters";
import { JobPostModal } from "@/components/JobPostModal";
import { MobileJobCard } from "@/components/MobileJobCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Job } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isJobPostModalOpen, setIsJobPostModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6); // Show 6 jobs per page to reduce Firebase reads
  const [isMobile, setIsMobile] = useState(false);
  
  const [filters, setFilters] = useState({
    jobTypes: [] as string[],
    salaryRange: "any",
    experienceLevels: [] as string[],
  });

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs", searchQuery, searchLocation, filters.jobTypes.join(","), currentPage, jobsPerPage],
    queryFn: async ({ queryKey }) => {
      const [url, query, location, jobTypes, page, limit] = queryKey;
      const params = new URLSearchParams();
      
      if (query) params.append("query", query as string);
      if (location) params.append("location", location as string);
      if (jobTypes && jobTypes !== "") params.append("jobType", jobTypes as string);
      params.append("page", String(page));
      params.append("limit", String(limit));
      
      const response = await fetch(`${url}?${params}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsApplicationModalOpen(true);
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsJobDetailsModalOpen(true);
  };

  const handleJobPost = () => {
    setIsJobPostModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-primary/70 mb-8 max-w-2xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and aspirations
          </p>
            {/* Enhanced Search Bar */}
          <div className="max-w-4xl mx-auto">
            <EnhancedSearchBar
              searchQuery={searchQuery}
              searchLocation={searchLocation}
              onSearchQueryChange={setSearchQuery}
              onSearchLocationChange={setSearchLocation}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </div>
        </div>
      </section>      {/* Advertisement Banner */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <HeaderBannerAd showInDev={true} />
        </div>
      </div><main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with Filters and Ads */}
          <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            <div className="sticky top-8 w-full" style={{ minWidth: '250px', maxWidth: '300px' }}>
              <JobFilters filters={filters} onFiltersChange={setFilters} />
            </div>
              {/* Sidebar Ad - Desktop Only */}
            <div className="hidden lg:block sticky top-8 w-full" style={{ minWidth: '250px', maxWidth: '300px' }}>
              <SidebarAd showInDev={true} />
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  {isLoading ? "Loading..." : `${jobs.length} Jobs Found`}
                </h2>
                <p className="text-muted-foreground">Based on your search criteria</p>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="salary-high">Salary High to Low</SelectItem>
                    <SelectItem value="salary-low">Salary Low to High</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleJobPost}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post Job
                </Button>
              </div>
            </div>            {/* Job Cards with Enhanced Design */}
            <div className={`${isMobile ? 'space-y-3' : 'grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-animation'}`}>
              {isLoading ? (
                // Enhanced loading skeletons
                isMobile ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <MobileJobCardSkeleton key={i} />
                  ))                ) : (
                  Array.from({ length: jobsPerPage }).map((_, i) => (
                    <EnhancedJobCardSkeleton key={i} />
                  ))
                )
              ) : jobs.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <h3 className="text-xl font-semibold text-primary mb-2">No jobs found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or filters to find more opportunities.
                    </p>
                  </CardContent>
                </Card>              ) : (
                jobs.map((job, index) => (
                  <div key={job.id} className="animate-fade-in-up">
                    {isMobile ? (
                      <MobileJobCard 
                        job={job} 
                        onApply={handleApply} 
                        onView={handleViewJob}
                      />
                    ) : (
                      <EnhancedJobCard 
                        job={job} 
                        onApply={handleApply} 
                        onView={handleViewJob}
                      />
                    )}                      {/* In-Content Ad every 4th job */}
                    {(index + 1) % 4 === 0 && (
                      <InContentAd className="my-6" showInDev={true} />
                    )}
                    
                    {/* Sponsored Content Card every 6th job */}
                    {(index + 1) % 6 === 0 && (
                      <Card className="bg-secondary border-2 border-dashed border-secondary/60 mt-4 animate-scale-in">
                        <CardContent className="p-6 text-center">
                          <Megaphone className="mx-auto h-8 w-8 text-primary mb-3" />
                          <h4 className="text-lg font-semibold text-primary mb-2">
                            Sponsored Content
                          </h4>
                          <p className="text-primary/70 text-sm mb-4">
                            Boost your hiring with premium job postings
                          </p>
                          <Button 
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground btn-enhanced"
                          >
                            Learn More
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}            {jobs.length > 0 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {/* Show current page */}
                <Button className="bg-primary text-primary-foreground">
                  {currentPage}
                </Button>
                
                {/* Show next page if there might be more data */}
                {jobs.length === jobsPerPage && (
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    {currentPage + 1}
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={jobs.length < jobsPerPage}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <ApplicationModal
        job={selectedJob}
        isOpen={isApplicationModalOpen}
        onClose={() => {
          setIsApplicationModalOpen(false);
          setSelectedJob(null);
        }}
      />
      
      <JobPostModal
        isOpen={isJobPostModalOpen}
        onClose={() => setIsJobPostModalOpen(false)}
      />

      <JobDetailsModal
        job={selectedJob}
        isOpen={isJobDetailsModalOpen}
        onClose={() => {
          setIsJobDetailsModalOpen(false);
          setSelectedJob(null);
        }}
        onApply={handleApply}
      />      {/* Mobile Sticky Ad */}
      <MobileStickyAd showInDev={true} />

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  );
}
