import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Building, Users, TreePine } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { ApplicationModal } from "@/components/ApplicationModal";
import { type Job } from "@shared/schema";

export default function Municipality() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs", searchQuery, searchLocation, "municipality"],
    queryFn: async ({ queryKey }) => {
      const [url, query, location] = queryKey;
      const params = new URLSearchParams();
      
      if (query) params.append("query", query as string);
      if (location) params.append("location", location as string);
      
      // Filter for municipality-related jobs
      const response = await fetch(`${url}?${params}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const allJobs = await response.json();
      
      // Filter for municipal positions
      return allJobs.filter((job: Job) => 
        job.company.toLowerCase().includes('city') ||
        job.company.toLowerCase().includes('town') ||
        job.company.toLowerCase().includes('county') ||
        job.company.toLowerCase().includes('municipal') ||
        job.title.toLowerCase().includes('municipal') ||
        job.description.toLowerCase().includes('municipal') ||
        job.description.toLowerCase().includes('city')
      );
    },
  });

  const handleSearch = () => {
    // Query will automatically refetch when searchQuery or searchLocation changes
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsApplicationModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Building className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Municipal Careers
          </h1>
          <p className="text-xl text-primary/70 mb-8 max-w-2xl mx-auto">
            Build stronger communities through local government and municipal service opportunities
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 py-2 border-r border-gray-200">
              <Search className="text-gray-400 mr-3 h-5 w-5" />
              <Input
                type="text"
                placeholder="Municipal position, department..."
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
                placeholder="City, County"
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
              Search Positions
            </Button>
          </div>
        </div>
      </section>

      {/* Municipal Services Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">
            Municipal Service Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">Community Services</h3>
                <p className="text-muted-foreground">
                  Recreation, libraries, social services, and community development
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Building className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">Public Works</h3>
                <p className="text-muted-foreground">
                  Infrastructure, utilities, maintenance, and urban planning
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TreePine className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">Parks & Environment</h3>
                <p className="text-muted-foreground">
                  Parks management, environmental protection, and sustainability
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary">
            {isLoading ? "Loading..." : `${jobs.length} Municipal Positions Available`}
          </h2>
          <p className="text-muted-foreground">Local government opportunities in cities, towns, and counties</p>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
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
                <Building className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">No municipal positions found</h3>
                <p className="text-muted-foreground">
                  Check back soon for new municipal job opportunities, or try adjusting your search criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} onApply={handleApply} />
            ))
          )}
        </div>
      </main>

      {/* Application Modal */}
      <ApplicationModal
        job={selectedJob}
        isOpen={isApplicationModalOpen}
        onClose={() => {
          setIsApplicationModalOpen(false);
          setSelectedJob(null);
        }}
      />
    </div>
  );
}