import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Trash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export type Investment = {
  id: number;
  title: string;
  description: string;
  total_needed: string;
  total_invested: string;
  profit_or_loss: string;
  hide_status: boolean;
  active_status: boolean;
  refund_status: boolean;
  image: string;
  createdAt: string;
};

export const columns: ColumnDef<Investment>[] = [
  {
    accessorKey: "id",
    header: "Investment ID",
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex items-center">
        <div className="w-12 h-8 relative overflow-hidden mr-3">
          <Image
            src={row.original.image}
            alt={row.original.title}
            fill
            className="object-cover rounded"
          />
        </div>
        <span className="text-sm font-medium">{row.original.title}</span>
      </div>
    ),
  },
  {
    accessorKey: "total_needed",
    header: "Total Needed",
  },
  {
    accessorKey: "total_invested",
    header: "Total Invested",
  },
  {
    accessorKey: "profit_or_loss",
    header: "Profit/Loss (%)",
  },
  {
    accessorKey: "active_status",
    header: "Active",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          row.original.active_status
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {row.original.active_status ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "hide_status",
    header: "Hidden",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          row.original.hide_status
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {row.original.hide_status ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "refund_status",
    header: "Refunded",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          row.original.refund_status
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {row.original.refund_status ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <span className="text-sm text-gray-700">
          {date.toLocaleDateString()}{" "}
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const investmentId = row.original.id;

      const handleDelete = async () => {
        const token = localStorage.getItem("authToken");

        if (!token) {
          alert("Authorization error. Please login again.");
          return;
        }

        const confirm = window.confirm(
          "Are you sure you want to delete this investment?"
        );
        if (!confirm) return;

        try {
          const res = await fetch(
            `https://api.backend.t-coin.saveneed.com/api/investment-projects/${investmentId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await res.json();

          if (res.ok) {
            alert("Investment deleted successfully.");
            window.location.reload(); // Or use state update to remove row from table
          } else {
            alert(data.message || "Failed to delete investment.");
          }
        } catch (error) {
          console.error("Delete error:", error);
          alert("An error occurred while deleting.");
        }
      };

      return (
        <div className="flex gap-2">
          <Link href={`/investment/${investmentId}`}>
            <Button
              size="icon"
              className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            size="icon"
            variant="destructive"
            onClick={handleDelete}
            className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
