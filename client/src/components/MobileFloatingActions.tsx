import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    Bookmark,
    ChevronUp,
    Filter,
    Plus,
    Search,
    X
} from "lucide-react";
import { useEffect, useState } from "react";

interface MobileFloatingActionsProps {
  onPostJob?: () => void;
  onShowFilters?: () => void;
  onSearch?: () => void;
  onShowSaved?: () => void;
  jobCount?: number;
  hasActiveFilters?: boolean;
}

export function MobileFloatingActions({
  onPostJob,
  onShowFilters,
  onSearch,
  onShowSaved,
  jobCount = 0,
  hasActiveFilters = false
}: MobileFloatingActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Track scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const actions = [
    {
      icon: Filter,
      label: "Filters",
      onClick: onShowFilters,
      badge: hasActiveFilters,
      className: "bg-blue-600 hover:bg-blue-700 text-white"
    },
    {
      icon: Search,
      label: "Search",
      onClick: onSearch,
      className: "bg-green-600 hover:bg-green-700 text-white"
    },
    {
      icon: Bookmark,
      label: "Saved",
      onClick: onShowSaved,
      className: "bg-purple-600 hover:bg-purple-700 text-white"
    },
    {
      icon: Plus,
      label: "Post Job",
      onClick: onPostJob,
      className: "bg-primary hover:bg-primary/90 text-primary-foreground"
    }
  ];

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <div className="fixed bottom-24 right-4 z-40 md:hidden">
          <Button
            size="icon"
            onClick={scrollToTop}
            className="h-12 w-12 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Floating Action Menu */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        {/* Backdrop */}
        {isExpanded && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          />
        )}

        {/* Action Buttons */}
        <div className="relative">
          {isExpanded && (
            <div className="absolute bottom-16 right-0 space-y-3 animate-in slide-in-from-bottom-2 duration-300">
              {actions.map((action, index) => (
                <div
                  key={action.label}
                  className="flex items-center space-x-3"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {/* Action Label */}
                  <Card className="px-3 py-2 shadow-lg bg-white/95 backdrop-blur-sm">
                    <span className="text-sm font-medium text-gray-700">
                      {action.label}
                    </span>
                  </Card>
                  
                  {/* Action Button */}
                  <div className="relative">
                    <Button
                      size="icon"
                      onClick={() => {
                        action.onClick?.();
                        setIsExpanded(false);
                      }}
                      className={cn(
                        "h-12 w-12 rounded-full shadow-lg transition-all duration-200",
                        action.className
                      )}
                    >
                      <action.icon className="h-6 w-6" />
                    </Button>
                    
                    {/* Badge for filters */}
                    {action.badge && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                        !
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Main FAB */}
          <Button
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              isExpanded && "rotate-45"
            )}
          >
            {isExpanded ? (
              <X className="h-6 w-6" />
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </Button>

          {/* Job Count Badge */}
          {jobCount > 0 && !isExpanded && (
            <Badge className="absolute -top-2 -left-2 h-6 px-2 bg-green-500 text-white text-xs">
              {jobCount} jobs
            </Badge>
          )}
        </div>
      </div>
    </>
  );
}

// Mobile Filters Sheet Component
export function MobileFiltersSheet({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Filter Jobs</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// Mobile Search Overlay
export function MobileSearchOverlay({
  isOpen,
  onClose,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
          <h3 className="text-lg font-semibold">Search Jobs</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
