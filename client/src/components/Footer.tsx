import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="h-8 w-8" />
              <span className="text-2xl font-bold">Workbridge</span>
            </div>
            <p className="text-primary-foreground/80">
              Connecting talent with opportunity, building bridges to your career success.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-white transition-colors">Browse Jobs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Career Advice</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Resume Builder</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Salary Guide</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-white transition-colors">Post Jobs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Find Candidates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hiring Solutions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary/20 mt-8 pt-8 text-center text-primary-foreground/80">
          <p>&copy; 2024 Workbridge. All rights reserved. Built with ❤️ for connecting careers.</p>
        </div>
      </div>
    </footer>
  );
}
