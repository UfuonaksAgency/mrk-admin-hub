import { ComponentType, lazy, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartWrapper({ title, description, children, className = "" }: ChartWrapperProps) {
  return (
    <Card className={`hover:shadow-elegant transition-shadow min-w-0 overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="bg-gradient-primary bg-clip-text text-transparent text-lg sm:text-xl">{title}</CardTitle>
        {description && <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <Suspense fallback={<div className="h-48 sm:h-64 lg:h-[300px] animate-pulse bg-muted rounded"></div>}>
          {children}
        </Suspense>
      </CardContent>
    </Card>
  );
}

export function createDynamicChart<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>
) {
  return lazy(() => importFn());
}