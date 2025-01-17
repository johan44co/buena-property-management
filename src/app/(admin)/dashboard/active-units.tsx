import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUnits } from "@/util/unit";

export default async function ActiveUnits() {
  const { units } = await getUnits({
    where: { isOccupied: true },
  });
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-md">Active Units</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{units?.length || 0}</div>
        <p className="text-xs text-muted-foreground">
          Units currently occupied
        </p>
      </CardContent>
    </Card>
  );
}
