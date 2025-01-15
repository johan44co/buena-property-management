"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type Property = {
  id: string;
  type: "residential" | "commercial";
  name: string;
  status: "active" | "inactive";
};

export const columns: ColumnDef<Property>[] = [
  {
    id: "actions",
    cell: function Action({ row }) {
      const property = row.original;
      const router = useRouter();

      return (
        <Button
          variant="outline"
          onClick={() => router.push(`/properties/${property.id}`)}
        >
          View
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
