"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export type Admin = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  isApproved: boolean;
};

export const columns: ColumnDef<Admin>[] = [
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
    header: "Admin Id",
  },

  {
    accessorKey: "name",
    header: "Full Name",
  },
  {
    accessorKey: "type",
    header: "Type",
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
    accessorKey: "isApproved",
    header: "Is Approved",
  },

  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const admin = row.original;

      const handleApprove = async () => {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("authToken");
        const adminType = localStorage.getItem("adminType");

        if (!userStr || !token || !adminType) {
          console.error("Missing user/token/adminType");
          alert("Authorization error. Please log in again.");
          return;
        }

        const user = JSON.parse(userStr); // move this below the null check

        try {
          const url =
            adminType === "super-admin"
              ? `https://api.t-coin.code-studio4.com/api/super-admin/${user.id}/approve`
              : `https://api.t-coin.code-studio4.com/api/admins/${user.id}/approve`;
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              approveUserId: parseInt(admin.id),
              type: admin.type,
              approveStatus: true,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            alert("Admin approved successfully.");
            window.location.reload(); // Optional: Replace with state update
          } else {
            alert(data.message || "Failed to approve admin.");
          }
        } catch (error) {
          console.error("Error approving admin:", error);
          alert("An error occurred while approving.");
        }
      };

      return (
        <div className="flex gap-2">
          {!admin.isApproved && (
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
