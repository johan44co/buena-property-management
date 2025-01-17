"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Unit } from "@prisma/client";
import { format } from "date-fns";

export type UnitDataColumns = Pick<
  Unit,
  | "id"
  | "unitNumber"
  | "propertyId"
  | "isOccupied"
  | "leaseEnd"
  | "leaseStart"
  | "rentAmount"
  | "tenantId"
> & {
  property: {
    name: string;
  };
  tenant: {
    name: string | null;
  } | null;
};

export const unitColumns: ColumnDef<UnitDataColumns>[] = [
  {
    id: "actions",
    cell: function Action({ row }) {
      const unit = row.original;
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => router.push(`/units/${unit.id}/edit`)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/units/${unit.id}`)}>
              Overview
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "unitNumber",
    header: "Unit Number",
  },
  {
    accessorKey: "propertyId",
    header: "Property",
    cell: ({ row }) => {
      const unit = row.original;
      return unit.property.name;
    },
  },
  {
    accessorKey: "isOccupied",
    header: "Occupied",
    cell: ({ row }) => {
      const unit = row.original;
      return unit.isOccupied ? "Yes" : "No";
    },
  },
  {
    accessorKey: "leaseEnd",
    header: "Lease End",
    cell: ({ row }) => {
      const unit = row.original;
      if (!unit.leaseEnd) return "No end date";
      const leaseEnd = format(new Date(unit.leaseEnd), "MMMM d, yyyy");
      return leaseEnd;
    },
  },
  {
    accessorKey: "leaseStart",
    header: "Lease Start",
    cell: ({ row }) => {
      const unit = row.original;
      if (!unit.leaseStart) return "No start date";
      const leaseStart = format(new Date(unit.leaseStart), "MMMM d, yyyy");
      return leaseStart;
    },
  },
  {
    accessorKey: "rentAmount",
    header: "Rent Amount",
    cell: ({ row }) => {
      const unit = row.original;
      const rentAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(unit.rentAmount);
      return rentAmount;
    },
  },
  {
    accessorKey: "tenantId",
    header: "Tenant",
    cell: ({ row }) => {
      const unit = row.original;
      return unit.tenant?.name || "No tenant";
    },
  },
];
