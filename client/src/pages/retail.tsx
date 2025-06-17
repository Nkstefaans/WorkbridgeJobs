import { ApplicationModal } from "@/components/ApplicationModal";
import { EnhancedJobCard } from "@/components/EnhancedJobCard";
import {
  EnhancedJobCardSkeleton
} from "@/components/EnhancedSkeletons";
import {
  HeaderBannerAd,
  InContentAd,
  MobileStickyAd,
  SidebarAd
} from "@/components/GoogleAds";
import { JobDetailsModal } from "@/components/JobDetailsModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { type Job } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin, Search, ShoppingBag, Users } from "lucide-react";
import { useState } from "react";

export default function Retail() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(15); // Show more jobs per page with ultra-compact cards

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs", searchQuery, searchLocation, "retail", currentPage, jobsPerPage],
    queryFn: async ({ queryKey }) => {
      const [url, query, location, , page, limit] = queryKey;
      const params = new URLSearchParams();
      
      if (query) params.append("query", query as string);
      if (location) params.append("location", location as string);
      params.append("page", String(page));
      params.append("limit", String(limit));
      
      // Filter for retail-related jobs
      const response = await fetch(`${url}?${params}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const allJobs = await response.json();
      
      // Filter for retail positions
      return allJobs.filter((job: Job) => 
        job.company.toLowerCase().includes('retail') ||
        job.company.toLowerCase().includes('store') ||
        job.company.toLowerCase().includes('shop') ||
        job.company.toLowerCase().includes('mall') ||
        job.title.toLowerCase().includes('retail') ||
        job.title.toLowerCase().includes('sales') ||
        job.title.toLowerCase().includes('cashier') ||
        job.title.toLowerCase().includes('associate') ||
        job.description.toLowerCase().includes('retail') ||
        job.description.toLowerCase().includes('customer service')
      );
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });  const handleSearch = () => {
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

  // Calculate total pages (estimate since we're filtering client-side)
  const totalPages = Math.max(1, Math.ceil((jobs.length || 0) / jobsPerPage));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <ShoppingBag className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Retail Careers
          </h1>
          <p className="text-xl text-primary/70 mb-8 max-w-2xl mx-auto">
            Join the retail industry and build your career in sales, customer service, and store management
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 py-2 border-r border-gray-200">
              <Search className="text-gray-400 mr-3 h-5 w-5" />
              <Input
                type="text"
                placeholder="Retail position, store type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 focus:ring-0 focus:border-0 text-primary"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-2 border-r border-gray-200">
              <MapPin className="text-gray-400 mr-3 h-5 w-5" />
              <Input
                type="text"
                placeholder="Location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="border-0 focus:ring-0 focus:border-0 text-primary"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 font-medium"
            >
              Search Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Retail Benefits Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">
            Why Choose Retail?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">People Skills</h3>
                <p className="text-muted-foreground">
                  Develop customer service and communication skills in dynamic environments
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">Flexible Hours</h3>
                <p className="text-muted-foreground">
                  Part-time and full-time opportunities with flexible scheduling options
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">Career Growth</h3>
                <p className="text-muted-foreground">
                  Advance from sales associate to management with on-the-job training
                </p>
              </CardContent>
            </Card>
          </div>        </div>
      </section>

      {/* Header Banner Ad */}
      <HeaderBannerAd />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary">
                {isLoading ? "Loading..." : `${jobs.length} Retail Positions Available`}
              </h2>
              <p className="text-muted-foreground">Opportunities in stores, malls, and retail chains nationwide</p>
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, i) => (
                  <EnhancedJobCardSkeleton key={i} />
                ))
              ) : jobs.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="p-12 text-center">
                    <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-primary mb-2">No retail positions found</h3>
                    <p className="text-muted-foreground">
                      Check back soon for new retail opportunities, or try adjusting your search criteria.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                jobs.map((job, index) => (
                  <div key={job.id}>
                    <div className="animate-fade-in-up">
                      <EnhancedJobCard 
                        job={job} 
                        onApply={handleApply} 
                        onView={handleViewJob}
                      />
                    </div>
                    {/* In-content Ad every 4th job */}
                    {(index + 1) % 4 === 0 && index < jobs.length - 1 && (
                      <div className="xl:col-span-2">
                        <InContentAd />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
        
        {/* Pagination Controls */}
        {!isLoading && jobs.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>            </Pagination>
          </div>
        )}
          </div>

          {/* Sidebar with Ads - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <SidebarAd />
              <SidebarAd />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Ad */}
      <MobileStickyAd />{/* Application Modal */}
      <ApplicationModal
        job={selectedJob}
        isOpen={isApplicationModalOpen}
        onClose={() => {
          setIsApplicationModalOpen(false);
          setSelectedJob(null);
        }}
      />

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isJobDetailsModalOpen}
        onClose={() => {
          setIsJobDetailsModalOpen(false);
          setSelectedJob(null);
        }}
        onApply={() => {
          setIsJobDetailsModalOpen(false);
          setIsApplicationModalOpen(true);
        }}
      />
    </div>
  );
}