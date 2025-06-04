import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo on the left */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-wider">WORK BRIDGE</span>
          </Link>
        </div>
        
        {/* Navigation links in the center */}
        <nav className="hidden lg:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <Link 
            href="/" 
            className={`relative py-2 transition-all duration-300 ease-out hover:text-white group ${
              location === "/" ? "text-white" : "text-primary-foreground/80"
            }`}
          >
            Find Jobs
            <span className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ease-out ${
              location === "/" ? "w-full" : "w-0 group-hover:w-full"
            }`}></span>
          </Link>
          <Link 
            href="/post-job" 
            className={`relative py-2 transition-all duration-300 ease-out hover:text-white group ${
              location === "/post-job" ? "text-white" : "text-primary-foreground/80"
            }`}
          >
            Post Jobs
            <span className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ease-out ${
              location === "/post-job" ? "w-full" : "w-0 group-hover:w-full"
            }`}></span>
          </Link>
          <Link 
            href="/government" 
            className={`relative py-2 transition-all duration-300 ease-out hover:text-white group ${
              location === "/government" ? "text-white" : "text-primary-foreground/80"
            }`}
          >
            Government
            <span className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ease-out ${
              location === "/government" ? "w-full" : "w-0 group-hover:w-full"
            }`}></span>
          </Link>
          <Link 
            href="/municipality" 
            className={`relative py-2 transition-all duration-300 ease-out hover:text-white group ${
              location === "/municipality" ? "text-white" : "text-primary-foreground/80"
            }`}
          >
            Municipality
            <span className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ease-out ${
              location === "/municipality" ? "w-full" : "w-0 group-hover:w-full"
            }`}></span>
          </Link>
          <Link 
            href="/retail" 
            className={`relative py-2 transition-all duration-300 ease-out hover:text-white group ${
              location === "/retail" ? "text-white" : "text-primary-foreground/80"
            }`}
          >
            Retail
            <span className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ease-out ${
              location === "/retail" ? "w-full" : "w-0 group-hover:w-full"
            }`}></span>
          </Link>
        </nav>

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
              <Button variant="ghost" size="icon" className="lg:hidden">
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
                  href="/government" 
                  className="text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Government
                </Link>
                <Link 
                  href="/municipality" 
                  className="text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Municipality
                </Link>
                <Link 
                  href="/retail" 
                  className="text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Retail
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
