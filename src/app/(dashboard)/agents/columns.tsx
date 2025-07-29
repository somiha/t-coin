"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, ArrowUpDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

export type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "agent";
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

function AgentActions({
  agent,
  onActionComplete,
}: {
  agent: Agent;
  onActionComplete: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<"delete" | "toggle">();

  const handleAction = async (type: "delete" | "toggle") => {
    setActionType(type);
    setIsLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Authorization error. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      let endpoint = "";
      let method = "GET";
      let body = null;

      if (type === "delete") {
        endpoint = `https://api.t-coin.code-studio4.com/api/agents/${agent.id}`;
        method = "DELETE";
      } else if (type === "toggle") {
        endpoint = `https://api.t-coin.code-studio4.com/api/agents/${agent.id}`;
        method = "PUT";
        body = JSON.stringify({
          canReceiveRemittanceList: !agent.canReceiveRemittanceList,
        });
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success(
        type === "delete"
          ? "Agent deleted successfully"
          : `Remittance ${
              !agent.canReceiveRemittanceList ? "enabled" : "disabled"
            } successfully`
      );
      onActionComplete();
    } catch (error) {
      console.error("Action error:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* View Details Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {agent.image && (
                  <div className="relative h-24 w-24 min-w-[6rem]">
                    <Image
                      src={agent.image}
                      alt="Agent image"
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground">{agent.email}</p>
                  <p className="text-sm text-muted-foreground">{agent.phone}</p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-md ${
                        agent.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {agent.isApproved ? "Approved" : "Pending"}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-md ${
                        agent.canReceiveRemittanceList
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      Remittance:{" "}
                      {agent.canReceiveRemittanceList ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Basic Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <InfoRow label="ID" value={agent.id} />
                  <InfoRow label="Type" value={agent.type} />
                  {agent.birth_date && (
                    <InfoRow
                      label="Birth Date"
                      value={new Date(agent.birth_date).toLocaleDateString()}
                    />
                  )}
                  {agent.institution_name && (
                    <InfoRow
                      label="Institution"
                      value={agent.institution_name}
                    />
                  )}
                  <InfoRow label="Country" value={agent.country} />
                  <InfoRow label="City" value={agent.city} />
                  <InfoRow label="Address" value={agent.address} />
                  <InfoRow label="NID Number" value={agent.nid_card_number} />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Balances</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <InfoRow
                    label="T-Coin Balance"
                    value={agent.tcoin_balance || "0.00"}
                  />
                  <InfoRow
                    label="Local Currency"
                    value={agent.local_currency_balance || "0.00"}
                  />
                </div>
              </div>

              {agent.createdAt && (
                <div className="space-y-2">
                  <h4 className="font-medium">Dates</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <InfoRow
                      label="Created At"
                      value={new Date(agent.createdAt).toLocaleString()}
                    />
                    {agent.updatedAt && (
                      <InfoRow
                        label="Updated At"
                        value={new Date(agent.updatedAt).toLocaleString()}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {agent.qr_code && (
                <ImageBlock title="QR Code" src={agent.qr_code} />
              )}
              {agent.nid_card_front_pic_url && (
                <ImageBlock
                  title="NID Front"
                  src={agent.nid_card_front_pic_url}
                />
              )}
              {agent.nid_card_back_pic_url && (
                <ImageBlock
                  title="NID Back"
                  src={agent.nid_card_back_pic_url}
                />
              )}
              {agent.passport_file_url && (
                <ImageBlock title="Passport" src={agent.passport_file_url} />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleAction("delete")}
          disabled={isLoading && actionType === "delete"}
          className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
        >
          {isLoading && actionType === "delete" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>

        <Button
          size="sm"
          variant="outline"
          className={`${
            agent.canReceiveRemittanceList
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
          onClick={() => handleAction("toggle")}
          disabled={isLoading && actionType === "toggle"}
        >
          {isLoading && actionType === "toggle" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : agent.canReceiveRemittanceList ? (
            "Disable Remittance"
          ) : (
            "Enable Remittance"
          )}
        </Button>
      </div>
    </div>
  );
}

// Helper components
function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p>{value || "-"}</p>
    </div>
  );
}

function ImageBlock({ title, src }: { title: string; src: string }) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">{title}</h4>
      <div className="relative w-full h-40">
        <Image
          src={src}
          alt={title}
          fill
          className="rounded-md object-contain"
        />
      </div>
    </div>
  );
}

export const columns = (refreshData: () => void): ColumnDef<Agent>[] => [
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
          row.original.canReceiveRemittanceList
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {row.original.canReceiveRemittanceList ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "tcoin_balance",
    header: "TCoin Balance",
    cell: ({ row }) => <span>{row.original.tcoin_balance || "0.00"}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <AgentActions agent={row.original} onActionComplete={refreshData} />
    ),
  },
];
