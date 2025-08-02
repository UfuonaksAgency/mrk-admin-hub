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
      <CardHeader className="pb-2 text-center">
        <CardTitle className="bg-gradient-primary bg-clip-text text-transparent text-lg sm:text-xl">{title}</CardTitle>
        {description && <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full aspect-[4/3] grid place-items-center">
          <Suspense fallback={<div className="w-full h-full animate-pulse bg-muted rounded"></div>}>
            {children}
          </Suspense>
        </div>
      </CardContent>
    </Card>
  );
}

export function createDynamicChart<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>
) {
  return lazy(() => importFn());
}