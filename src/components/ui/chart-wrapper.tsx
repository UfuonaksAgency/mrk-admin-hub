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
    <Card className={`hover:shadow-elegant transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="bg-gradient-primary bg-clip-text text-transparent text-center">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground text-center">{description}</p>}
      </CardHeader>
      <CardContent className="p-6">
        <div className="w-full h-80 flex items-center justify-center">
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