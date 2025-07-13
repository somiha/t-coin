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
import Image from "next/image";

export type Participant = {
  ticketNumber: string;
  name: string;
  user_id: number;
  user_image: string | null;
  participationDate: string;
  participantType: string;
};

export const columns: ColumnDef<Participant>[] = [
  {
    accessorKey: "ticketNumber",
    header: "Ticket Number",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "participantType",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.participantType}</span>
    ),
  },
  {
    accessorKey: "participationDate",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.original.participationDate).toLocaleString(),
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const participant = row.original;
      return (
        <div className="flex space-x-2">
          <ViewParticipantModal participant={participant} />
        </div>
      );
    },
  },
];

function ViewParticipantModal({ participant }: { participant: Participant }) {
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
            <DialogTitle className="text-md bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] p-3 mb-2">
              Participant Info
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {participant.user_image && (
              <div className="flex justify-center">
                <Image
                  src={participant.user_image}
                  alt={participant.name}
                  width={100}
                  height={100}
                  className="rounded-full object-cover border shadow"
                />
              </div>
            )}

            <div className="space-y-1 text-sm">
              <p>
                <strong>Name:</strong> {participant.name}
              </p>
              <p>
                <strong>Ticket #:</strong> {participant.ticketNumber}
              </p>
              <p>
                <strong>Type:</strong>{" "}
                {participant.participantType.toUpperCase()}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(participant.participationDate).toLocaleString()}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
