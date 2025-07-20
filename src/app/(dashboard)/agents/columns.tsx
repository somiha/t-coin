// app/(dashboard)/agents/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "agent";
  isApproved: boolean;
  canReceiveRemittance?: boolean;
};

function ViewAgentModal({ agent }: { agent: Agent }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setIsOpen(true)}>
        <Eye className="h-4 w-4 mr-2" />
        View
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm">{agent.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{agent.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm">{agent.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge
                  variant="secondary"
                  className={`${
                    agent.isApproved
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {agent.isApproved ? "Approved" : "Pending"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Can Receive Remittance</p>
                <Badge
                  variant="secondary"
                  className={`${
                    agent.canReceiveRemittance
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {agent.canReceiveRemittance ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

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
    header: "ID",
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
    header: "Phone",
  },
  {
    accessorKey: "isApproved",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className={`${
          row.original.isApproved
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {row.original.isApproved ? "Approved" : "Pending"}
      </Badge>
    ),
  },
  {
    accessorKey: "canReceiveRemittance",
    header: "Can Receive Remittance",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className={`${
          row.original.canReceiveRemittance
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {row.original.canReceiveRemittance ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ViewAgentModal agent={row.original} />,
  },
];
