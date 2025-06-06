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
    Send
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

  return (
    <Card 
      className="mx-4 mb-4 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/20 cursor-pointer"
      onClick={() => onView(job)}
    >
      <CardContent className="p-4">
        {/* Mobile Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 border-2 border-border">
              <AvatarImage src={job.company_logo} alt={job.company} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {job.company.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground leading-tight line-clamp-1 text-lg">
                {job.title}
              </h3>
              <p className="text-muted-foreground text-sm font-medium">{job.company}</p>
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatTimeAgo(job.posted_date)}</span>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8 rounded-full transition-all duration-200",
              isSaved 
                ? "text-red-500 bg-red-50" 
                : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
            )}
            onClick={handleSaveToggle}
          >
            <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
          </Button>
        </div>

        {/* Mobile Metadata */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span className="flex-1">{job.location}</span>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Briefcase className="h-4 w-4 mr-1 text-primary" />
            <span className="capitalize">{job.job_type}</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="flex items-center justify-center w-6 h-6 rounded bg-green-100 mr-2">
              <DollarSign className="h-3 w-3 text-green-600" />
            </div>
            <span className="font-medium text-green-600">
              {formatSalary(job.salary_min ?? undefined, job.salary_max ?? undefined)}
            </span>
          </div>
        </div>

        {/* Mobile Description */}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-3">
          {truncateText(job.description, 100)}
        </p>

        {/* Mobile Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {job.skills.slice(0, 2).map((skill) => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="text-xs px-2 py-1 bg-primary/10 text-primary"
              >
                {skill}
              </Badge>
            ))}
            {job.skills.length > 2 && (
              <Badge variant="outline" className="text-xs border-dashed">
                +{job.skills.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Mobile Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onView(job);
            }}
            variant="outline" 
            size="sm"
            className="flex-1 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onApply(job);
            }}
            size="sm"
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="h-4 w-4 mr-1" />
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
