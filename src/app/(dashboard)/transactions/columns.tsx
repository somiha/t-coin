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
import { format } from "date-fns";

export type Transaction = {
  id: number;
  name: string;
  image: string;
  method: string;
  type: string;
  amount: string;
  charge: number;
  date: string;
  transaction_status?: string;
  description?: string;
  receiver_nid?: string;
  sender_nid?: string;
  method_label?: string;
  bank_name?: string;
  bank_branch_name?: string;
  account_holder_name?: string;
  account_number?: string;
  account_holder_mobile_number?: string;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "Transaction Id",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center">
        <div className="w-6 h-6 relative rounded-full overflow-hidden mr-4">
          <Image
            src={row.original.image}
            alt={row.original.name}
            fill
            className="object-cover"
          />
        </div>
        <span className="text-sm">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "method",
    header: "Method",
  },
  {
    accessorKey: "type",
    header: "Transaction Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "charge",
    header: "Charge",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const raw = row.original.date;
      try {
        return format(new Date(raw), "yyyy-MM-dd HH:mm");
      } catch {
        return "Invalid Date";
      }
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div className="flex space-x-2">
          <ViewTransactionModal transaction={transaction} />
        </div>
      );
    },
  },
];

function ViewTransactionModal({ transaction }: { transaction: Transaction }) {
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
              {transaction.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            <p>
              <strong>Method:</strong> {transaction.method}
            </p>
            <p>
              <strong>Type:</strong> {transaction.type}
            </p>
            <p>
              <strong>Amount:</strong> {transaction.amount}
            </p>
            <p>
              <strong>Charge:</strong> {transaction.charge}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {transaction.date && !isNaN(new Date(transaction.date).getTime())
                ? format(new Date(transaction.date), "yyyy-MM-dd HH:mm")
                : "Invalid Date"}
            </p>
            {transaction.transaction_status && (
              <p>
                <strong>Status:</strong> {transaction.transaction_status}
              </p>
            )}
            {transaction.description && (
              <p>
                <strong>Description:</strong> {transaction.description}
              </p>
            )}
            {transaction.receiver_nid && (
              <p>
                <strong>Receiver NID:</strong> {transaction.receiver_nid}
              </p>
            )}
            {transaction.sender_nid && (
              <p>
                <strong>Sender NID:</strong> {transaction.sender_nid}
              </p>
            )}
            {transaction.method_label && (
              <p>
                <strong>Method Label:</strong> {transaction.method_label}
              </p>
            )}
            {transaction.bank_name && (
              <p>
                <strong>Bank Name:</strong> {transaction.bank_name}
              </p>
            )}
            {transaction.bank_branch_name && (
              <p>
                <strong>Bank Branch:</strong> {transaction.bank_branch_name}
              </p>
            )}
            {transaction.account_holder_name && (
              <p>
                <strong>Account Holder:</strong>{" "}
                {transaction.account_holder_name}
              </p>
            )}
            {transaction.account_number && (
              <p>
                <strong>Account Number:</strong> {transaction.account_number}
              </p>
            )}
            {transaction.account_holder_mobile_number && (
              <p>
                <strong>Account Mobile:</strong>{" "}
                {transaction.account_holder_mobile_number}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
