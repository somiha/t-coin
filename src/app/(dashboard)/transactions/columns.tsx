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
  sender_name?: string;
  receiver_name?: string;
  sender_image_url?: string;
  receiver_image_url?: string;
  transaction_type?: string;
  local_currency_amount?: string;
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
        <DialogContent className="fixed max-h-[90vh] w-[800px] max-w-[90vw] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pt-2 pb-4">
            <DialogTitle className="text-md text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))]">
              Transaction Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pb-4">
            {/* Transaction Overview */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-500">Transaction ID</h3>
                <p className="mt-1">{transaction.id}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Status</h3>
                <p className="mt-1 capitalize">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      transaction.transaction_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : transaction.transaction_status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {transaction.transaction_status}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Date</h3>
                <p className="mt-1">
                  {transaction.date &&
                  !isNaN(new Date(transaction.date).getTime())
                    ? format(new Date(transaction.date), "yyyy-MM-dd HH:mm")
                    : "Invalid Date"}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Transaction Type</h3>
                <p className="mt-1">
                  {transaction.transaction_type || transaction.type}
                </p>
              </div>
            </div>

            {/* Parties Involved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-3">Sender Information</h3>
                <div className="flex items-start space-x-4">
                  {transaction.sender_image_url && (
                    <div className="w-12 h-12 relative rounded-full overflow-hidden">
                      <Image
                        src={transaction.sender_image_url}
                        alt={transaction.sender_name || "Sender"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {transaction.sender_name || "N/A"}
                    </p>
                    {transaction.sender_nid && (
                      <p className="text-sm text-gray-500">
                        NID: {transaction.sender_nid}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-3">
                  Receiver Information
                </h3>
                <div className="flex items-start space-x-4">
                  {transaction.receiver_image_url && (
                    <div className="w-12 h-12 relative rounded-full overflow-hidden">
                      <Image
                        src={transaction.receiver_image_url}
                        alt={transaction.receiver_name || "Receiver"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {transaction.receiver_name || "N/A"}
                    </p>
                    {transaction.receiver_nid && (
                      <p className="text-sm text-gray-500">
                        NID: {transaction.receiver_nid}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-lg mb-3">Transaction Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-500">Amount</h3>
                  <p className="mt-1">{transaction.amount} T-Coin</p>
                </div>
                {transaction.local_currency_amount && (
                  <div>
                    <h3 className="font-medium text-gray-500">Local Amount</h3>
                    <p className="mt-1">৳{transaction.local_currency_amount}</p>
                  </div>
                )}
                {transaction.charge && (
                  <div>
                    <h3 className="font-medium text-gray-500">Charge</h3>
                    <p className="mt-1">{transaction.charge}</p>
                  </div>
                )}
                {transaction.method_label && (
                  <div>
                    <h3 className="font-medium text-gray-500">Method</h3>
                    <p className="mt-1">{transaction.method_label}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Details (if available) */}
            {(transaction.bank_name || transaction.account_number) && (
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-3">Bank Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {transaction.bank_name && (
                    <div>
                      <h3 className="font-medium text-gray-500">Bank Name</h3>
                      <p className="mt-1">{transaction.bank_name}</p>
                    </div>
                  )}
                  {transaction.bank_branch_name && (
                    <div>
                      <h3 className="font-medium text-gray-500">Branch Name</h3>
                      <p className="mt-1">{transaction.bank_branch_name}</p>
                    </div>
                  )}
                  {transaction.account_holder_name && (
                    <div>
                      <h3 className="font-medium text-gray-500">
                        Account Holder
                      </h3>
                      <p className="mt-1">{transaction.account_holder_name}</p>
                    </div>
                  )}
                  {transaction.account_number && (
                    <div>
                      <h3 className="font-medium text-gray-500">
                        Account Number
                      </h3>
                      <p className="mt-1">{transaction.account_number}</p>
                    </div>
                  )}
                  {transaction.account_holder_mobile_number && (
                    <div>
                      <h3 className="font-medium text-gray-500">
                        Mobile Number
                      </h3>
                      <p className="mt-1">
                        {transaction.account_holder_mobile_number}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {transaction.description && (
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {transaction.description}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
