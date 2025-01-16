import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActiveUnits() {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-md">Active Units</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">0</div>
        <p className="text-xs text-muted-foreground">
          Units currently occupied
        </p>
      </CardContent>
    </Card>
  );
}
