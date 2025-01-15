"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Property = {
  id: string;
  type: "residential" | "commercial";
  name: string;
};

export const columns: ColumnDef<Property>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
];
