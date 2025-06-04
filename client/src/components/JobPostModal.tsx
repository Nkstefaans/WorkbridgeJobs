import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Image, X } from "lucide-react";
import { type InsertJob, insertJobSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

const jobFormSchema = insertJobSchema.extend({
  skills_input: z.string().optional(),
});

type JobFormData = z.infer<typeof jobFormSchema>;

interface JobPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JobPostModal({ isOpen, onClose }: JobPostModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      description: "",
      salary_min: undefined,
      salary_max: undefined,
      job_type: "Full-time",
      skills: [],
      company_logo: "",
      skills_input: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertJob) => {
      const response = await apiRequest("POST", "/api/jobs", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Job Posted",
        description: "Your job posting has been successfully created!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      onClose();
      form.reset();
      setLogoFile(null);
    },
    onError: (error) => {
      toast({
        title: "Job Posting Failed",
        description: error.message || "Failed to create job posting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: JobFormData) => {
    const skills = data.skills_input 
      ? data.skills_input.split(",").map(skill => skill.trim()).filter(Boolean)
      : [];

    const jobData: InsertJob = {
      title: data.title,
      company: data.company,
      location: data.location,
      description: data.description,
      salary_min: data.salary_min,
      salary_max: data.salary_max,
      job_type: data.job_type,
      skills,
      company_logo: logoFile ? URL.createObjectURL(logoFile) : undefined,
    };

    mutation.mutate(jobData);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Post a New Job
          </DialogTitle>
          <p className="text-muted-foreground">
            Fill out the details to post your job opening
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="e.g., Senior Software Engineer"
              className="mt-1"
            />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                {...form.register("company")}
                className="mt-1"
              />
              {form.formState.errors.company && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.company.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...form.register("location")}
                placeholder="e.g., San Francisco, CA or Remote"
                className="mt-1"
              />
              {form.formState.errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="job_type">Job Type *</Label>
              <Select 
                value={form.watch("job_type")} 
                onValueChange={(value) => form.setValue("job_type", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="salary_min">Min Salary</Label>
              <Input
                id="salary_min"
                type="number"
                {...form.register("salary_min", { valueAsNumber: true })}
                placeholder="80000"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="salary_max">Max Salary</Label>
              <Input
                id="salary_max"
                type="number"
                {...form.register("salary_max", { valueAsNumber: true })}
                placeholder="120000"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              rows={6}
              {...form.register("description")}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="mt-1"
            />
            {form.formState.errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="skills_input">Required Skills</Label>
            <Input
              id="skills_input"
              {...form.register("skills_input")}
              placeholder="React, Node.js, JavaScript (comma separated)"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="company_logo">Company Logo</Label>
            <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleLogoChange}
                className="hidden"
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="cursor-pointer">
                <Image className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                {logoFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <p className="text-primary">{logoFile.name}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setLogoFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-muted-foreground">Upload company logo</p>
                    <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {mutation.isPending ? "Posting..." : "Post Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
