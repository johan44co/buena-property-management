"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@prisma/client";
import RowActions from "@/components/row-actions";

export type TenantDataColumns = Pick<User, "id" | "name" | "email">;

export const tenantColumns: ColumnDef<TenantDataColumns>[] = [
  {
    id: "actions",
    cell: function Action({ row }) {
      const tenant = row.original;
      return <RowActions id={tenant.id} />;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
