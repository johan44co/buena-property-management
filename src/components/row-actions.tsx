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

export default function RowActions({ id }: { id: string }) {
  const router = useRouter();
  const params = useParams();

  if (params.entity === "rent") {
    return (
      <Button
        onClick={() => router.push(`/${params.entity}/${id}/pay`)}
        variant="outline"
      >
        <span>Pay</span>
      </Button>
    );
  }

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
          onClick={() => router.push(`/${params.entity}/${id}/edit`)}
        >
          Edit
        </DropdownMenuItem>
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
