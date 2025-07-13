"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

export type Savings = {
  id: string;
  name: string;
  type: string;
  amount: number;
  mobile_number: string;
  country: string;
  address: string;
  date: string;
};

export const columns: ColumnDef<Savings>[] = [
  { accessorKey: "id", header: "Savings Id", size: 100 },
  { accessorKey: "name", header: "Full Name" },
  { accessorKey: "type", header: "Savings Type" },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "mobile_number", header: "Mobile Number" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "date", header: "Date" },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const savings = row.original;
      return (
        <div className="flex space-x-2">
          <Link href={`/savings/${savings.id}`}>
            <Button
              size="icon"
              variant="ghost"
              className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
