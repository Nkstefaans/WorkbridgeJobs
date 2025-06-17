import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatSalary, formatTimeAgo, truncateText } from "@/lib/utils";
import { type Job } from "@shared/schema";
import {
    DollarSign,
    Eye,
    Heart,
    MapPin,
    Send
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

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <Card 
      className="group relative overflow-hidden bg-card border-border/50 hover:border-primary/20 transition-all duration-200 hover:shadow-md cursor-pointer"
      onClick={() => onView(job)}
    >
      {/* New Job Badge */}
      {isRecentJob(job.posted_date) && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 border-green-200">
            New
          </Badge>
        </div>
      )}

      <CardContent className="relative p-3">
        {/* Ultra Compact Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2.5 flex-1 min-w-0">
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarImage src={job.company_logo} alt={job.company} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {job.company.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground leading-tight line-clamp-1 text-sm mb-0.5 group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-muted-foreground text-xs">{job.company}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-6 w-6 rounded-full transition-all duration-200",
              isSaved 
                ? "text-red-500 bg-red-50" 
                : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
            )}
            onClick={handleSaveToggle}
          >
            <Heart className={cn("h-3 w-3", isSaved && "fill-current")} />
          </Button>
        </div>

        {/* Single Row Info */}
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[100px]">{job.location}</span>
            </div>
            <span>•</span>
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 capitalize">
              {job.job_type}
            </Badge>
            <span>•</span>
            <span>{formatTimeAgo(job.posted_date)}</span>
          </div>
        </div>

        {/* Salary & Description */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <DollarSign className="h-3 w-3 text-green-600 mr-1" />
              <span className="font-semibold text-green-600 text-sm">
                {formatSalary(job.salary_min ?? undefined, job.salary_max ?? undefined)}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-xs line-clamp-1 leading-relaxed">
            {truncateText(job.description, 80)}
          </p>
        </div>

        {/* Skills & Actions Combined */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1 flex-1 mr-2">
            {job.skills && job.skills.length > 0 && (
              <>
                {job.skills.slice(0, 2).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs px-1.5 py-0.5">
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 2 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-muted-foreground">
                    +{job.skills.length - 2}
                  </Badge>
                )}
              </>
            )}
          </div>
          
          <div className="flex items-center gap-1.5">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onView(job)}
              className="h-6 px-2 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onApply(job);
              }}
              className="h-6 px-2 text-xs bg-primary hover:bg-primary/90"
            >
              <Send className="h-3 w-3 mr-1" />
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
