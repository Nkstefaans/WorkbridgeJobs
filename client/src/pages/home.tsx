import { ApplicationModal } from "@/components/ApplicationModal";
import { JobCard } from "@/components/JobCard";
import { JobDetailsModal } from "@/components/JobDetailsModal";
import { JobFilters } from "@/components/JobFilters";
import { JobPostModal } from "@/components/JobPostModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { type Job } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Megaphone, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isJobPostModalOpen, setIsJobPostModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    jobTypes: [] as string[],
    salaryRange: "any",
    experienceLevels: [] as string[],
  });

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs", searchQuery, searchLocation, filters.jobTypes.join(",")],
    queryFn: async ({ queryKey }) => {
      const [url, query, location, jobTypes] = queryKey;
      const params = new URLSearchParams();
      
      if (query) params.append("query", query as string);
      if (location) params.append("location", location as string);
      if (jobTypes && jobTypes !== "") params.append("jobType", jobTypes as string);
      
      const response = await fetch(`${url}?${params}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      return response.json();
    },
  });

  const handleSearch = () => {
    // The query will automatically refetch when searchQuery or searchLocation changes
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
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 py-2 border-r border-gray-200">
              <Search className="text-gray-400 mr-3 h-5 w-5" />
              <Input
                type="text"
                placeholder="Job title, keywords..."
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

      {/* Advertisement Banner */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <Card className="bg-secondary">
            <CardContent className="p-4 text-center">
              <p className="text-primary text-sm font-medium">
                <Megaphone className="inline w-4 h-4 mr-2" />
                Advertisement Space - Premium Job Board Solutions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <JobFilters filters={filters} onFiltersChange={setFilters} />

          {/* Job Listings */}
          <div className="lg:w-3/4">
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
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Skeleton className="w-12 h-12 rounded-lg" />
                            <div>
                              <Skeleton className="h-6 w-48 mb-1" />
                              <Skeleton className="h-4 w-32" />
                            </div>
                          </div>
                          <div className="flex space-x-4 mb-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-28" />
                          </div>
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4 mb-3" />
                          <div className="flex space-x-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-12" />
                          </div>
                        </div>
                        <div className="ml-4 space-y-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-10 w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : jobs.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <h3 className="text-xl font-semibold text-primary mb-2">No jobs found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or filters to find more opportunities.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                jobs.map((job, index) => (
                  <div key={job.id}>
                    <JobCard job={job} onApply={handleApply} onView={handleViewJob} />
                    
                    {/* Advertisement Card every 3rd job */}
                    {(index + 1) % 3 === 0 && (
                      <Card className="bg-secondary border-2 border-dashed border-secondary/60 mt-4">
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
                            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
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

            {/* Pagination */}
            {jobs.length > 0 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button className="bg-primary text-primary-foreground">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <span className="px-3 py-2 text-muted-foreground">...</span>
                <Button variant="outline">25</Button>
                <Button variant="outline" size="sm">
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
      />
    </div>
  );
}
