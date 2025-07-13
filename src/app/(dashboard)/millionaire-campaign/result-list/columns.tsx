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

export type Result = {
  id: string;
  name: string;
  participate_date: string;
  ticket_number: string;
  date: string;
  duration: string;
};

export const columns: ColumnDef<Result>[] = [
  {
    accessorKey: "id",
    header: "Result Id",
    size: 100,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "participate_date",
    header: "Participate Date",
  },
  {
    accessorKey: "ticket_number",
    header: "Ticket Number",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const result = row.original;
      return (
        <div className="flex space-x-2">
          <ViewResultModal result={result} />
        </div>
      );
    },
  },
];

function ViewResultModal({ result }: { result: Result }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        size="icon"
        className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
        onClick={() => setIsOpen(true)}
      >
        <Eye className="w-4 h-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-md text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] p-3 rounded-md mb-4">
              {result.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Details:</p>
                <p className="text-sm">{result.ticket_number}</p>

                <p className="text-sm">{result.date}</p>

                <p className="text-sm">{result.duration}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
