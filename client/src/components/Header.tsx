import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Briefcase, Building2, MapPin, Menu, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { href: "/", label: "Find Jobs", icon: Search, isActive: location === "/" },
    { href: "/government", label: "Government", icon: Building2, isActive: location === "/government" },
    { href: "/municipality", label: "Municipality", icon: MapPin, isActive: location === "/municipality" },
    { href: "/retail", label: "Retail", icon: Briefcase, isActive: location === "/retail" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto">
        {/* Main Header */}
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Briefcase className="h-6 w-6" />
              <span className="text-xl font-bold tracking-wide">WorkBridge</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`relative py-2 px-3 rounded-md transition-all duration-300 ease-out hover:bg-primary-foreground/10 ${
                  item.isActive ? "bg-primary-foreground/20 text-white" : "text-primary-foreground/90"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Post Job Button (Desktop) */}
          <div className="hidden md:block">
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white text-primary hover:bg-gray-100"
              asChild
            >
              <Link href="/post-job">
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="p-4 border-b bg-primary text-primary-foreground">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-6 w-6" />
                    <span className="text-xl font-bold">WorkBridge</span>
                  </div>
                  <p className="text-sm text-primary-foreground/80 mt-1">Find your dream job in South Africa</p>
                </div>

                {/* Mobile Navigation */}
                <div className="flex-1 p-4">
                  <nav className="space-y-3">
                    {navigationItems.map((item) => (
                      <Link 
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                          item.isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                        {item.isActive && (
                          <Badge variant="secondary" className="ml-auto">
                            Active
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Post Job Button */}
                  <div className="mt-6 pt-6 border-t">
                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      asChild
                    >
                      <Link href="/post-job" onClick={() => setIsOpen(false)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Post a Job
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Mobile Menu Footer */}
                <div className="p-4 border-t bg-gray-50 text-center">
                  <p className="text-sm text-gray-600">
                    Connect talent with opportunity
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Quick Access Bar */}
        <div className="md:hidden border-t border-primary-foreground/20">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-4 overflow-x-auto">
              {navigationItems.slice(1).map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                    item.isActive 
                      ? "bg-primary-foreground/20 text-white" 
                      : "text-primary-foreground/70 hover:text-white"
                  }`}
                >
                  <item.icon className="h-3 w-3" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>        </div>
      </div>
    </header>
  );
}
