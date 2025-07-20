"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "admin" | "agent";
  isApproved: boolean;
  canReceiveRemittance?: boolean;
};

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        className={`capitalize px-2 py-1 rounded-md ${
          row.original.type === "admin"
            ? "bg-blue-100 text-blue-700"
            : "bg-purple-100 text-purple-700"
        }`}
      >
        {row.original.type}
      </Badge>
    ),
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
        className={`px-2 py-1 rounded-md ${
          row.original.isApproved
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {row.original.isApproved ? "Approved" : "Pending"}
      </Badge>
    ),
  },
  {
    accessorKey: "canReceiveRemittance",
    header: "Can Receive Remittance",
    cell: ({ row }) =>
      row.original.type === "agent" ? (
        <Badge
          className={`px-2 py-1 rounded-md ${
            row.original.canReceiveRemittance
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.original.canReceiveRemittance ? "Yes" : "No"}
        </Badge>
      ) : null,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      const handleApprove = async () => {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("authToken");
        const adminType = localStorage.getItem("adminType");

        if (!userStr || !token || !adminType) {
          alert("Authorization error. Please log in again.");
          return;
        }

        const currentUser = JSON.parse(userStr);
        console.log("currentUser", currentUser);

        try {
          const response = await fetch(
            `https://api.t-coin.code-studio4.com/api/super-admin/${currentUser.id}/approve`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                approveUserId: parseInt(user.id),
                type: user.type,
                approveStatus: true,
              }),
            }
          );

          const data = await response.json();

          if (response.ok) {
            alert(`${user.type.toUpperCase()} approved successfully`);
            window.location.reload();
          } else {
            alert(data.message || "Approval failed");
          }
        } catch (error) {
          console.error("Approval error:", error);
          alert("Something went wrong. Try again.");
        }
      };

      return (
        <div className="flex gap-2">
          {!user.isApproved && (
            <Button
              size="sm"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleApprove}
            >
              Approve
            </Button>
          )}
        </div>
      );
    },
  },
];
