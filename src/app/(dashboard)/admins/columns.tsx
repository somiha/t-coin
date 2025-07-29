"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { UserActions } from "./userActions";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "admin" | "agent";
  isApproved: boolean;
  canReceiveRemittanceList?: boolean;
  image?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  state?: string | null;
  zip_code?: string | null;
  nid_card_number?: string | null;
  nid_card_front_pic_url?: string | null;
  nid_card_back_pic_url?: string | null;
  passport_file_url?: string | null;
  qr_code?: string | null;
  createdAt?: string;
  updatedAt?: string;
  tcoin_balance?: string;
  local_currency_balance?: string;
  accepted_terms?: boolean;
  birth_date?: string | null;
  institution_name?: string | null;
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
    accessorKey: "canReceiveRemittanceList",
    header: "Can Receive Remittance",
    cell: ({ row }) =>
      row.original.type === "agent" ? (
        <Badge
          className={`px-2 py-1 rounded-md ${
            row.original.canReceiveRemittanceList
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.original.canReceiveRemittanceList ? "Yes" : "No"}
        </Badge>
      ) : null,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <UserActions user={row.original} />,
  },
];
