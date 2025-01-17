import { RevenueSummary } from "@/components/revenue-summary";
import RentCollection from "@/components/rent-collection";
import TotalRevenue from "@/components/total-revenue";
import ActiveUnits from "@/components/active-units";
import TotalProperties from "@/components/total-properties";

export default async function AdminDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="lg:text-center grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TotalRevenue />
        <ActiveUnits />
        <TotalProperties className="hidden lg:block" />
      </div>
      <div className="grid auto-rows-min gap-4 lg:grid-cols-2">
        <RevenueSummary />

        <RentCollection />
      </div>
    </div>
  );
}
