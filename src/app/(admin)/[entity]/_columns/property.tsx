"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Property } from "@prisma/client";
import RowActions from "@/components/row-actions";

export type PropertyDataColumns = Pick<
  Property,
  "id" | "type" | "name" | "status"
>;

export const propertyColumns: ColumnDef<PropertyDataColumns>[] = [
  {
    id: "actions",
    cell: function Action({ row }) {
      const property = row.original;
      return <RowActions id={property.id} />;
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
