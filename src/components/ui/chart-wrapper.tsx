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
      <CardHeader>
        <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div className="h-[300px] animate-pulse bg-muted rounded"></div>}>
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