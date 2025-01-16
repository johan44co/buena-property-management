import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function TotalProperties({ className }: { className?: string }) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-0">
        <CardTitle className="text-md">Total Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">0</div>
        <p className="text-xs text-muted-foreground">
          Properties currently managed
        </p>
      </CardContent>
    </Card>
  );
}
