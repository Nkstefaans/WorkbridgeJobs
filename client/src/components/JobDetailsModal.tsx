import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatSalary, formatTimeAgo } from "@/lib/utils";
import { type Job } from "@shared/schema";
import { Briefcase, Building2, Clock, DollarSign, MapPin } from "lucide-react";

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
}

export function JobDetailsModal({ job, isOpen, onClose, onApply }: JobDetailsModalProps) {
  if (!job) return null;

  const handleApply = () => {
    onApply(job);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {job.company_logo && (
                <img 
                  src={job.company_logo} 
                  alt={`${job.company} logo`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <DialogTitle className="text-2xl font-bold text-primary pr-8">
                  {job.title}
                </DialogTitle>
                <p className="text-lg text-muted-foreground flex items-center mt-1">
                  <Building2 className="w-4 h-4 mr-2" />
                  {job.company}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span className="capitalize">{job.job_type}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span>{formatSalary(job.salary_min ?? undefined, job.salary_max ?? undefined)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{formatTimeAgo(job.posted_date)}</span>
            </div>
          </div>

          <Separator />

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Job Description</h3>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                {job.description}
              </p>
            </div>
          </div>

          {/* Skills & Requirements */}
          {job.skills && job.skills.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Required Skills & Qualifications</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Application Section */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              onClick={handleApply}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium flex-1"
              size="lg"
            >
              Apply for this Position
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              size="lg"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
