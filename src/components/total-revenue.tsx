import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TotalRevenue() {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-md">Total Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">€0</div>
        <p className="text-xs text-muted-foreground">
          Total revenue from all sources
        </p>
      </CardContent>
    </Card>
  );
}
