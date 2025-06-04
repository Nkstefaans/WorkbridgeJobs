import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone } from "lucide-react";

interface JobFiltersProps {
  filters: {
    jobTypes: string[];
    salaryRange: string;
    experienceLevels: string[];
  };
  onFiltersChange: (filters: any) => void;
}

export function JobFilters({ filters, onFiltersChange }: JobFiltersProps) {
  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    const newJobTypes = checked 
      ? [...filters.jobTypes, jobType]
      : filters.jobTypes.filter(type => type !== jobType);
    
    onFiltersChange({
      ...filters,
      jobTypes: newJobTypes
    });
  };

  const handleExperienceChange = (level: string, checked: boolean) => {
    const newLevels = checked 
      ? [...filters.experienceLevels, level]
      : filters.experienceLevels.filter(l => l !== level);
    
    onFiltersChange({
      ...filters,
      experienceLevels: newLevels
    });
  };

  return (
    <aside className="lg:w-1/4 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Filters</h3>
          
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-primary mb-3 block">Job Type</Label>
              <div className="space-y-3">
                {["Full-time", "Part-time", "Remote", "Contract"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={type}
                      checked={filters.jobTypes.includes(type)}
                      onCheckedChange={(checked) => 
                        handleJobTypeChange(type, checked as boolean)
                      }
                    />
                    <Label htmlFor={type} className="text-sm text-muted-foreground">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-primary mb-3 block">Salary Range</Label>
              <Select 
                value={filters.salaryRange} 
                onValueChange={(value) => 
                  onFiltersChange({ ...filters, salaryRange: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any salary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any salary</SelectItem>
                  <SelectItem value="30-50">R30k - R50k</SelectItem>
                  <SelectItem value="50-80">R50k - R80k</SelectItem>
                  <SelectItem value="80-120">R80k - R120k</SelectItem>
                  <SelectItem value="120+">R120k+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-primary mb-3 block">Experience Level</Label>
              <div className="space-y-3">
                {["Entry Level", "Mid Level", "Senior Level"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox 
                      id={level}
                      checked={filters.experienceLevels.includes(level)}
                      onCheckedChange={(checked) => 
                        handleExperienceChange(level, checked as boolean)
                      }
                    />
                    <Label htmlFor={level} className="text-sm text-muted-foreground">
                      {level}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Advertisement Sidebar */}
      <Card className="bg-secondary">
        <CardContent className="pt-6">
          <div className="text-center">
            <Megaphone className="mx-auto h-12 w-12 text-primary mb-4" />
            <h4 className="font-semibold text-primary mb-2">Featured Companies</h4>
            <p className="text-primary/70 text-sm">
              Discover opportunities with top employers
            </p>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
