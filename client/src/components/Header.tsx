import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Briefcase, Menu } from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8" />
            <span className="text-2xl font-bold">Workbridge</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              href="/" 
              className={`transition-colors hover:text-white ${
                location === "/" ? "text-white" : "text-primary-foreground/80"
              }`}
            >
              Find Jobs
            </Link>
            <Link 
              href="/post-job" 
              className={`transition-colors hover:text-white ${
                location === "/post-job" ? "text-white" : "text-primary-foreground/80"
              }`}
            >
              Post Jobs
            </Link>
            <Link 
              href="/companies" 
              className={`transition-colors hover:text-white ${
                location === "/companies" ? "text-white" : "text-primary-foreground/80"
              }`}
            >
              Companies
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="hidden sm:inline-flex text-primary-foreground hover:text-white hover:bg-primary/20"
          >
            Sign In
          </Button>
          <Button 
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium"
          >
            Get Started
          </Button>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Find Jobs
                </Link>
                <Link 
                  href="/post-job" 
                  className="text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Post Jobs
                </Link>
                <Link 
                  href="/companies" 
                  className="text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Companies
                </Link>
                <Button className="w-full mt-4">Sign In</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
