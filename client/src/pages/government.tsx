import { ApplicationModal } from "@/components/ApplicationModal";
import { JobCard } from "@/components/JobCard";
import { EnhancedJobCard } from "@/components/EnhancedJobCard";
import { MobileJobCard } from "@/components/MobileJobCard";
import { EnhancedSearchBar } from "@/components/EnhancedSearchBar";
import {
  EnhancedJobCardSkeleton,
  MobileJobCardSkeleton,
  PageLoadingSkeleton,
} from "@/components/EnhancedSkeletons";
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
import { Skeleton } from "@/components/ui/skeleton";
import { 
  HeaderBannerAd, 
  SidebarAd, 
  InContentAd, 
  MobileStickyAd 
} from "@/components/GoogleAds";
import { type Job } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Building2, MapPin, Search, Shield } from "lucide-react";
import { useState, useEffect } from "react";

export default function Government() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6); // Show 6 jobs per page to reduce Firebase reads
  const [isMobile, setIsMobile] = useState(false);

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
    queryKey: [
      "/api/jobs",
      searchQuery,
      searchLocation,
      "government",
      currentPage,
      jobsPerPage,
    ],
    queryFn: async ({ queryKey }) => {
      const [url, query, location, , page, limit] = queryKey;
      const params = new URLSearchParams();

      if (query) params.append("query", query as string);
      if (location) params.append("location", location as string);
      params.append("page", String(page));
      params.append("limit", String(limit));

      // Filter for government-related jobs
      const response = await fetch(`${url}?${params}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const allJobs = await response.json();

      // Filter for government positions
      return allJobs.filter(
        (job: Job) =>
          job.company.toLowerCase().includes("government") ||
          job.company.toLowerCase().includes("federal") ||
          job.company.toLowerCase().includes("state") ||
          job.company.toLowerCase().includes("department") ||
          job.title.toLowerCase().includes("government") ||
          job.description.toLowerCase().includes("government")
      );
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

  // Calculate total pages (estimate since we're filtering client-side)
  const totalPages = Math.max(1, Math.ceil((jobs.length || 0) / jobsPerPage));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Government Careers
          </h1>
          <p className="text-xl text-primary/70 mb-8 max-w-2xl mx-auto">
            Serve your community and make a difference with government positions at
            federal, state, and local levels
          </p>          {/* Enhanced Search Bar */}
          <div className="max-w-4xl mx-auto">
            <EnhancedSearchBar
              searchQuery={searchQuery}
              searchLocation={searchLocation}
              onSearchQueryChange={setSearchQuery}
              onSearchLocationChange={setSearchLocation}
              onSearch={handleSearch}
              isLoading={isLoading}
              placeholder="Government position, department..."
              locationPlaceholder="City, State"
            />
          </div>
        </div>
      </section>

      {/* Government Benefits Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">
            Why Choose Government Work?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Job Security
                </h3>
                <p className="text-muted-foreground">
                  Stable employment with comprehensive benefits and retirement plans
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Building2 className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Make an Impact
                </h3>
                <p className="text-muted-foreground">
                  Contribute to public service and make a real difference in your
                  community
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Search className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Career Growth
                </h3>
                <p className="text-muted-foreground">
                  Clear advancement paths and professional development opportunities
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
                {isLoading
                  ? "Loading..."
                  : `${jobs.length} Government Positions Available`}
              </h2>
              <p className="text-muted-foreground">
                Public service opportunities across all levels of government
              </p>
            </div>

            {/* Enhanced Job Cards */}
            <div className={`${isMobile ? 'space-y-3' : 'grid grid-cols-1 xl:grid-cols-2 gap-6 stagger-animation'}`}>
          {isLoading ? (
            // Enhanced loading skeletons
            isMobile ? (
              Array.from({ length: 5 }).map((_, i) => (
                <MobileJobCardSkeleton key={i} />
              ))
            ) : (
              Array.from({ length: jobsPerPage }).map((_, i) => (
                <EnhancedJobCardSkeleton key={i} />
              ))
            )
          ) : jobs.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-12 text-center">
                <Shield className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">
                  No government positions found
                </h3>
                <p className="text-muted-foreground">
                  Check back soon for new government job opportunities, or try
                  adjusting your search criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
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
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
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
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
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
      <MobileStickyAd />
      {/* Application Modal */}
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