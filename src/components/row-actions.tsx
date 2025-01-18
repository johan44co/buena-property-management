"use client";
import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import React from "react";

export default function RowActions({ id }: { id: string }) {
  const router = useRouter();
  const params = useParams();

  const defaultActions = [
    {
      action: "Edit",
      onClick: () => router.push(`/${params.entity}/${id}/edit`),
    },
  ];

  const rentActions = [
    {
      action: "Pay",
      onClick: () => router.push(`/${params.entity}/${id}/checkout`),
    },
  ];

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
        {(params.entity === "rent" ? rentActions : defaultActions).map(
          (action, index) => (
            <React.Fragment key={index}>
              <DropdownMenuItem onClick={action.onClick}>
                {action.action}
              </DropdownMenuItem>
            </React.Fragment>
          ),
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/${params.entity}/${id}`)}
        >
          Overview
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
