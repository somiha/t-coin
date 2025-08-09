"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  avatar: string;
  status: "active" | "hold" | "blocked";
};

function UserActions({
  userId,
  userName,
  currentStatus,
  refreshData,
}: {
  userId: string;
  userName: string;
  currentStatus: "active" | "hold" | "blocked";
  refreshData: () => void;
}) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [newStatus, setNewStatus] = useState<"active" | "hold" | "blocked">(
    currentStatus
  );

  const handleSendNotification = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(
        `https://api.t-coin.code-studio4.com/api/notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: Number(userId),
            message: message,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send notification");

      toast.success("Notification sent successfully");
      setIsDialogOpen(false);
      setMessage("");
    } catch (error) {
      toast.error("Failed to send notification");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(
        "https://api.t-coin.code-studio4.com/api/users/bulk-update/multiple",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            userIds: [Number(userId)],
            userType: "user",
            updateData: { status: newStatus },
            note: statusNote || `Status updated to ${newStatus}`,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      toast.success(`Status updated to ${newStatus}`);
      setIsStatusDialogOpen(false);
      setStatusNote("");
      refreshData?.();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const getStatusBadge = (status: "active" | "hold" | "blocked") => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
        );
      case "hold":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Hold</Badge>
        );
      case "blocked":
        return <Badge className="bg-red-500 hover:bg-red-600">blocked</Badge>;
      default:
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>
        );
    }
  };

  const getStatusDialogBadge = (status: "active" | "hold" | "blocked") => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case "hold":
        return <Badge className="bg-yellow-500 text-white">Hold</Badge>;
      case "blocked":
        return <Badge className="bg-red-500 text-white">blocked</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {getStatusBadge(currentStatus)}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setNewStatus("active");
              setIsStatusDialogOpen(true);
            }}
            disabled={currentStatus === "active"}
          >
            Mark as Active
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setNewStatus("hold");
              setIsStatusDialogOpen(true);
            }}
            disabled={currentStatus === "hold"}
          >
            Put on Hold
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setNewStatus("blocked");
              setIsStatusDialogOpen(true);
            }}
            disabled={currentStatus === "blocked"}
          >
            blocked User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getStatusDialogBadge(newStatus)}
              <span className="text-sm text-muted-foreground">
                Update {userName}&apos;s status
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Textarea
              placeholder="Add a note (optional)"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>Confirm Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Link href={`/users/${userId}`}>
        <Button
          size="icon"
          variant="ghost"
          className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </Link>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
          >
            <Bell className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Notification to {userName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              placeholder="Enter your notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              onClick={handleSendNotification}
              disabled={isSending}
              className="w-full"
            >
              {isSending ? "Sending..." : "Send Notification"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
    header: "User Id",
  },
  {
    id: "avatar",
    header: () => null,
    cell: ({ row }) => (
      <div className="w-10 h-10 relative rounded-full overflow-hidden">
        <Image
          src={row.original.avatar}
          alt={row.original.name}
          fill
          className="object-cover"
        />
      </div>
    ),
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
    header: "Mobile Number",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      console.log("Row data:", row.original);

      const status = row.original.status?.toLowerCase();
      return (
        <Badge
          className={
            status === "active"
              ? "bg-green-500 hover:bg-green-600 text-white"
              : status === "hold"
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : status === "blocked"
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-500 hover:bg-gray-600 text-white"
          }
        >
          {status
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : "Unknown"}
        </Badge>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row, table }) => (
      <UserActions
        userId={row.original.id}
        userName={row.original.name}
        currentStatus={row.original.status}
        refreshData={() => {
          const meta = table.options.meta as { refreshData?: () => void };
          if (meta?.refreshData) {
            meta.refreshData();
          }
        }}
      />
    ),
  },
];
