import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, DollarSign, Clock, Heart } from "lucide-react";
import { type Job } from "@shared/schema";
import { formatSalary, formatTimeAgo, truncateText } from "@/lib/utils";
import { useState } from "react";

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              {job.company_logo && (
                <img 
                  src={job.company_logo} 
                  alt={`${job.company} logo`}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold text-primary">
                  {job.title}
                </h3>
                <p className="text-muted-foreground">{job.company}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </span>
              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                {job.job_type}
              </span>
              <span className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {formatSalary(job.salary_min, job.salary_max)}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatTimeAgo(job.posted_date)}
              </span>
            </div>
            
            <p className="text-muted-foreground mb-3 line-clamp-2">
              {truncateText(job.description, 150)}
            </p>
            
            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 4).map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="bg-secondary text-secondary-foreground"
                  >
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 4 && (
                  <Badge variant="outline">
                    +{job.skills.length - 4} more
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="ml-4 flex flex-col items-end space-y-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveToggle}
              className={`transition-colors ${
                isSaved 
                  ? "text-red-500 hover:text-red-600" 
                  : "text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
            </Button>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onApply(job);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
