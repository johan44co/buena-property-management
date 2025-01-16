import { RevenueSummary } from "./revenue-summary";
import RentCollection from "./rent-collection";
import TotalRevenue from "./total-revenue";
import ActiveUnits from "./active-units";
import TotalProperties from "./total-properties";

export default async function Page() {
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
