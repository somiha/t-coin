"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  avatar: string;
};

export const columns: ColumnDef<Agent>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Agent Id",
  },
  {
    id: "avatar",
    header: () => null,
    cell: ({ row }) => (
      <div className="w-10 h-10 relative rounded-full overflow-hidden">
        <Image
          src={row.original.avatar}
          alt={row.original.name}
          fill
          className="object-cover"
        />
      </div>
    ),
  },

  {
    accessorKey: "name",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Mobile Number",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const agentId = row.original.id;
      return (
        <Link href={`/agents/${agentId}`}>
          <Button
            size="icon"
            className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90 cursor-pointer transition-opacity"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
      );
    },
  },
];
