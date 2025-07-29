"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

export function UserActions({
  user,
  onActionComplete,
}: {
  user: {
    id: string;
    type: "admin" | "agent";
    isApproved: boolean;
    canReceiveRemittanceList?: boolean;
    name: string;
    email: string;
    phone: string;
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
  };
  onActionComplete?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<
    "approve" | "delete" | "toggle"
  >();

  const handleAction = async (type: "approve" | "delete" | "toggle") => {
    setActionType(type);
    setIsLoading(true);

    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");
    const adminType = localStorage.getItem("adminType");

    if (!userStr || !token || !adminType) {
      alert("Authorization error. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = JSON.parse(userStr);
      let endpoint = "";
      let method = "GET";
      let body = null;

      if (type === "approve") {
        endpoint = `https://api.t-coin.code-studio4.com/api/super-admin/${currentUser.id}/approve`;
        method = "POST";
        body = JSON.stringify({
          approveUserId: parseInt(user.id),
          type: user.type,
          approveStatus: true,
        });
      } else if (type === "delete") {
        endpoint =
          user.type === "admin"
            ? `https://api.t-coin.code-studio4.com/api/admins/${user.id}`
            : `https://api.t-coin.code-studio4.com/api/agents/${user.id}`;
        method = "DELETE";
      } else if (type === "toggle") {
        endpoint = `https://api.t-coin.code-studio4.com/api/agents/${user.id}`;
        method = "PUT";
        body = JSON.stringify({
          canReceiveRemittanceList: !user.canReceiveRemittanceList,
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

      const data = await response.json();

      if (response.ok) {
        alert(
          type === "approve"
            ? `${user.type.toUpperCase()} approved successfully`
            : type === "delete"
            ? `${user.type.toUpperCase()} deleted successfully`
            : `Remittance ${
                !user.canReceiveRemittanceList ? "enabled" : "disabled"
              } successfully`
        );
        onActionComplete?.();
      } else {
        alert(data.message || "Action failed");
      }
    } catch (error) {
      console.error("Action error:", error);
      alert("Something went wrong. Try again.");
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
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {user.image && (
                  <div className="relative h-24 w-24 min-w-[6rem]">
                    <Image
                      src={user.image}
                      alt="User image"
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Basic Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <InfoRow label="Type" value={user.type} />
                  <InfoRow
                    label="Status"
                    value={user.isApproved ? "Approved" : "Pending"}
                  />
                  <InfoRow label="Country" value={user.country} />
                  <InfoRow label="City" value={user.city} />
                  <InfoRow label="Address" value={user.address} />
                  <InfoRow label="NID Number" value={user.nid_card_number} />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Balances</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <InfoRow
                    label="T-Coin Balance"
                    value={user.tcoin_balance || "0.00"}
                  />
                  <InfoRow
                    label="Local Currency"
                    value={user.local_currency_balance || "0.00"}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {user.qr_code && (
                <ImageBlock title="QR Code" src={user.qr_code} />
              )}
              {user.nid_card_front_pic_url && (
                <ImageBlock
                  title="NID Front"
                  src={user.nid_card_front_pic_url}
                />
              )}
              {user.nid_card_back_pic_url && (
                <ImageBlock title="NID Back" src={user.nid_card_back_pic_url} />
              )}
              {user.passport_file_url && (
                <ImageBlock title="Passport" src={user.passport_file_url} />
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
          className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
          onClick={() => handleAction("delete")}
          disabled={isLoading && actionType === "delete"}
        >
          {isLoading && actionType === "delete" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Delete"
          )}
        </Button>

        {!user.isApproved && (
          <Button
            size="sm"
            className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
            onClick={() => handleAction("approve")}
            disabled={isLoading && actionType === "approve"}
          >
            {isLoading && actionType === "approve" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Approve"
            )}
          </Button>
        )}

        {user.type === "agent" && (
          <Button
            size="sm"
            variant="outline"
            className={`${
              user.canReceiveRemittanceList
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
            onClick={() => handleAction("toggle")}
            disabled={isLoading && actionType === "toggle"}
          >
            {isLoading && actionType === "toggle" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : user.canReceiveRemittanceList ? (
              "Disable Remittance"
            ) : (
              "Enable Remittance"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// 🔧 Helper components for cleaner UI

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
