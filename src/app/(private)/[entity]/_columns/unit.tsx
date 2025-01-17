"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Unit } from "@prisma/client";
import { format } from "date-fns";
import RowActions from "@/components/row-actions";
import { formatCurrency } from "@/util/currency";

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
      return <RowActions id={unit.id} />;
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
    accessorKey: "rentAmount",
    header: "Rent Amount",
    cell: ({ row }) => {
      const unit = row.original;
      return formatCurrency(unit.rentAmount);
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
    accessorKey: "tenantId",
    header: "Tenant",
    cell: ({ row }) => {
      const unit = row.original;
      return unit.tenant?.name || "No tenant";
    },
  },
];
