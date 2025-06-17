import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatSalary, formatTimeAgo } from "@/lib/utils";
import { type Job } from "@shared/schema";
import {
    DollarSign,
    Heart,
    MapPin
} from "lucide-react";
import { useState } from "react";

interface MobileJobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  onView: (job: Job) => void;
}

export function MobileJobCard({ job, onApply, onView }: MobileJobCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply(job);
  };

  return (
    <Card 
      className="mx-3 mb-1.5 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/30 cursor-pointer bg-white"
      onClick={() => onView(job)}
    >
      <CardContent className="p-2.5">
        {/* Ultra Compact Header */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Avatar className="h-8 w-8 border border-primary/20">
              <AvatarImage src={job.company_logo} alt={job.company} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                {job.company.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground leading-tight line-clamp-1 text-sm">
                {job.title}
              </h3>
              <p className="text-muted-foreground text-xs">{job.company}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-6 w-6 rounded-full transition-all duration-200 flex-shrink-0",
              isSaved 
                ? "text-red-500 bg-red-50" 
                : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
            )}
            onClick={handleSaveToggle}
          >
            <Heart className={cn("h-3 w-3", isSaved && "fill-current")} />
          </Button>
        </div>

        {/* Single Line Info + Actions */}
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[80px]">{job.location}</span>
            </div>
            <span>•</span>
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 capitalize">
              {job.job_type}
            </Badge>
          </div>
          <div className="flex items-center space-x-1.5">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onView(job)}
              className="h-6 px-2 text-xs"
            >
              View
            </Button>
            <Button 
              size="sm"
              onClick={handleApply}
              className="h-6 px-2 text-xs bg-primary hover:bg-primary/90"
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Salary & Time in One Line */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center">
            <DollarSign className="h-3 w-3 text-green-600 mr-1" />
            <span className="font-semibold text-green-600 text-xs">
              {formatSalary(job.salary_min ?? undefined, job.salary_max ?? undefined)}
            </span>
          </div>
          <span className="text-muted-foreground">{formatTimeAgo(job.posted_date)}</span>
        </div>

        {/* Skills - Only if space allows */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {job.skills.slice(0, 2).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs px-1 py-0.5">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 2 && (
              <Badge variant="outline" className="text-xs px-1 py-0.5 text-muted-foreground">
                +{job.skills.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
