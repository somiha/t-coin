"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { format } from "date-fns";

export type Remittance = {
  id: string;
  country: string;
  method: string;
  amount: number;
  date: string; // raw ISO date
};

export const columns: ColumnDef<Remittance>[] = [
  { accessorKey: "id", header: "Remittance Id", size: 100 },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "method", header: "Method" },
  { accessorKey: "amount", header: "Amount" },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const raw = row.original.date;
      try {
        return format(new Date(raw), "yyyy-MM-dd");
      } catch {
        return "Invalid Date";
      }
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => <ViewRemittanceModal remittance={row.original} />,
  },
];

function ViewRemittanceModal({ remittance }: { remittance: Remittance }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
        onClick={() => setIsOpen(true)}
      >
        <Eye className="w-4 h-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remittance Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p>
              <strong>ID:</strong> {remittance.id}
            </p>
            <p>
              <strong>Country:</strong> {remittance.country}
            </p>
            <p>
              <strong>Method:</strong> {remittance.method}
            </p>
            <p>
              <strong>Amount:</strong> {remittance.amount}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {format(new Date(remittance.date), "yyyy-MM-dd HH:mm")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
