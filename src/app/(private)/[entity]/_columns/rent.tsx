"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Unit } from "@prisma/client";
import { format } from "date-fns";
import RowActions from "@/components/row-actions";

export type RentDataColumns = Pick<
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
    address: string;
  };
};

export const rentColumns: ColumnDef<RentDataColumns>[] = [
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
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const unit = row.original;
      return unit.property.address;
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
];
