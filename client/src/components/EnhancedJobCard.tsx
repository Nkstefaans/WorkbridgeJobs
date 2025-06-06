import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatSalary, formatTimeAgo, truncateText } from "@/lib/utils";
import { type Job } from "@shared/schema";
import {
    Briefcase,
    Clock,
    DollarSign,
    Eye,
    Heart,
    MapPin,
    Send,
    Users
} from "lucide-react";
import { useState } from "react";

interface EnhancedJobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  onView: (job: Job) => void;
}

// Helper function to check if job is recent (posted within 3 days)
const isRecentJob = (postedDate: string): boolean => {
  const posted = new Date(postedDate);
  const now = new Date();
  const diffInDays = (now.getTime() - posted.getTime()) / (1000 * 3600 * 24);
  return diffInDays <= 3;
};

export function EnhancedJobCard({ job, onApply, onView }: EnhancedJobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <Card 
      className="group relative overflow-hidden bg-card border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={() => onView(job)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="relative p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            {/* Company Logo with enhanced styling */}
            <div className="relative">
              <Avatar className="h-14 w-14 border-2 border-border group-hover:border-primary/30 transition-colors">
                <AvatarImage src={job.company_logo} alt={job.company} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {job.company.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator for recent jobs */}
              {isRecentJob(job.posted_date) && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-foreground leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-1">
                {job.title}
              </h3>
              <p className="text-muted-foreground font-medium">{job.company}</p>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{job.location}</span>
                <Separator orientation="vertical" className="mx-2 h-3" />
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatTimeAgo(job.posted_date)}</span>
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSaveToggle}
            className={cn(
              "h-8 w-8 rounded-full transition-all duration-200",
              isSaved 
                ? "text-red-500 bg-red-50 hover:bg-red-100" 
                : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
            )}
          >
            <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
          </Button>
        </div>

        {/* Job Metadata with improved layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <div className="flex items-center text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 mr-2">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Type</p>
              <p className="font-medium capitalize">{job.job_type}</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 mr-2">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Salary</p>
              <p className="font-medium text-green-600">
                {formatSalary(job.salary_min ?? undefined, job.salary_max ?? undefined)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center text-sm col-span-2 md:col-span-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 mr-2">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Level</p>
              <p className="font-medium">Mid-level</p>
            </div>
          </div>
        </div>

        {/* Description with better typography */}
        <div className="mb-4">
          <p className="text-muted-foreground leading-relaxed line-clamp-2">
            {truncateText(job.description, 120)}
          </p>
        </div>

        {/* Skills with improved design */}
        {job.skills && job.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 3).map((skill, index) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors font-medium px-3 py-1"
                >
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 3 && (
                <Badge variant="outline" className="border-dashed">
                  +{job.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border/50">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onView(job);
            }}
            variant="outline" 
            className="flex-1 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onApply(job);
            }}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Send className="h-4 w-4 mr-2" />
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
