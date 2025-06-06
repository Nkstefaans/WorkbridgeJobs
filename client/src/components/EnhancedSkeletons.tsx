import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Enhanced Job Card Skeleton with sophisticated loading animation
export function EnhancedJobCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            {/* Company Logo Skeleton */}
            <div className="relative">
              <Skeleton className="h-14 w-14 rounded-full" />
              {/* Recent job indicator placeholder */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
            </div>
            
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-20" />
                <div className="w-px h-3 bg-gray-200" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          
          {/* Save Button Skeleton */}
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Metadata Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Skills Skeleton */}
        <div className="flex space-x-2 mb-4">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        
        {/* Action Buttons Skeleton */}
        <div className="flex space-x-3 pt-4 border-t border-gray-100">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 flex-1 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

// Shimmer effect skeleton for images and content
export function ShimmerSkeleton({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-gray-200 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        className
      )} 
    />
  );
}

// Loading skeleton for search results
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <EnhancedJobCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Loading skeleton for filters panel
export function FiltersSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Filter sections */}
          {Array.from({ length: 4 }).map((_, sectionIndex) => (
            <div key={sectionIndex} className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, itemIndex) => (
                  <div key={itemIndex} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Mobile-optimized loading skeleton
export function MobileJobCardSkeleton() {
  return (
    <Card className="mx-4 mb-4 overflow-hidden animate-pulse">
      <CardContent className="p-4">
        {/* Mobile Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Mobile Metadata */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
            <div className="w-px h-4 bg-gray-200" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Mobile Description */}
        <div className="space-y-2 mb-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Mobile Skills */}
        <div className="flex space-x-1 mb-4">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>

        {/* Mobile Actions */}
        <div className="flex space-x-2">
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 flex-1 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

// Page loading skeleton with staggered animation
export function PageLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search bar skeleton */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <Skeleton className="h-14 flex-1" />
          <Skeleton className="h-14 lg:w-80" />
          <Skeleton className="h-14 w-32" />
        </div>
      </Card>

      {/* Filters and results layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters skeleton */}
        <div className="lg:col-span-1">
          <FiltersSkeleton />
        </div>

        {/* Results skeleton */}
        <div className="lg:col-span-3">
          <SearchResultsSkeleton />
        </div>
      </div>
    </div>
  );
}

// Error state skeleton for failed loads
export function ErrorSkeleton() {
  return (
    <Card className="p-12 text-center">
      <div className="space-y-4">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
        <Skeleton className="h-10 w-32 mx-auto" />
      </div>
    </Card>
  );
}
