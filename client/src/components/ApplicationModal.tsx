import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, X } from "lucide-react";
import { type Job, insertApplicationSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

const applicationFormSchema = insertApplicationSchema.extend({
  job_id: z.number()
});

type ApplicationFormData = z.infer<typeof applicationFormSchema>;

interface ApplicationModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationModal({ job, isOpen, onClose }: ApplicationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      job_id: job?.id || 0,
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      cover_letter: "",
      resume_file: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      const response = await apiRequest("POST", "/api/applications", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      onClose();
      form.reset();
      setResumeFile(null);
    },
    onError: (error) => {
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ApplicationFormData) => {
    if (!job) return;
    
    mutation.mutate({
      ...data,
      job_id: job.id,
      resume_file: resumeFile?.name || "",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Apply for Position
          </DialogTitle>
          <p className="text-muted-foreground">
            {job.title} at {job.company}
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                {...form.register("first_name")}
                className="mt-1"
              />
              {form.formState.errors.first_name && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.first_name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                {...form.register("last_name")}
                className="mt-1"
              />
              {form.formState.errors.last_name && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              className="mt-1"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              {...form.register("phone")}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="resume">Resume *</Label>
            <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <CloudUpload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                {resumeFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <p className="text-primary">{resumeFile.name}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setResumeFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-400">PDF, DOC, DOCX up to 10MB</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="cover_letter">Cover Letter</Label>
            <Textarea
              id="cover_letter"
              rows={5}
              {...form.register("cover_letter")}
              placeholder="Tell us why you're interested in this position..."
              className="mt-1"
            />
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
              {mutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
