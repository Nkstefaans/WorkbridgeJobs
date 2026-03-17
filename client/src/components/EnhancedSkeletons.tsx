import { Card, CardContent } from "@/components/ui/card";

export function EnhancedJobCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="space-y-2 p-4">
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-3 w-1/2 bg-muted rounded" />
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-full bg-muted rounded" />
      </CardContent>
    </Card>
  );
}

export function MobileJobCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="space-y-2 p-3">
        <div className="h-3 w-2/3 bg-muted rounded" />
        <div className="h-2.5 w-1/2 bg-muted rounded" />
        <div className="h-2.5 w-full bg-muted rounded" />
      </CardContent>
    </Card>
  );
}
