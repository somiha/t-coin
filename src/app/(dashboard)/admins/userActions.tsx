"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Eye,
  Trash,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
  Check,
  UserCog,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Admin {
  id: string;
  full_name: string;
  email: string;
  phone_no?: string;
  isApproved?: boolean;
  type?: "admin" | "agent";
  canReceiveRemittanceList?: boolean;
  image?: string | null;
}

interface ApiAdminResponse {
  id: string;
  full_name: string;
  email: string;
  phone_no?: string;
  isApproved?: boolean;
  type?: "admin" | "agent";
  canReceiveRemittanceList?: boolean;
  image?: string | null;
}
interface UserActionsProps {
  user: User;
  onActionComplete?: () => void;
  onUserUpdate?: (updates: Partial<User>) => void;
  onUserDelete?: (userId: string) => void;
}
interface User {
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
}

export function UserActions({
  user,
  onActionComplete,
  onUserUpdate,
  onUserDelete,
}: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [actionType, setActionType] = useState<
    "approve" | "delete" | "toggle" | "assign"
  >();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState("");

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found");

      const res = await fetch(
        "https://api.backend.t-coin.saveneed.com/admins",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const json = await res.json();
      const data = Array.isArray(json) ? json : json.data;

      if (!Array.isArray(data)) throw new Error("Invalid data");

      const formatted: Admin[] = data
        .map((admin: ApiAdminResponse): Admin | null => {
          try {
            return {
              id: admin.id.toString(),
              full_name: admin.full_name || "Unnamed Admin",
              email: admin.email || "no-email@example.com",
            };
          } catch {
            return null;
          }
        })
        .filter((a): a is Admin => !!a);

      setAdmins(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch admins");
      setAdmins([]);
    }
  };

  //   const handleAction = async (
  //     type: "approve" | "delete" | "toggle" | "assign"
  //   ) => {
  //     setActionType(type);
  //     setIsLoading(true);

  //     try {
  //       const token = localStorage.getItem("authToken");
  //       const userStr = localStorage.getItem("user");
  //       const currentUser = userStr ? JSON.parse(userStr) : null;

  //       if (!token || !currentUser?.id) {
  //         throw new Error("Authorization error. Please log in again.");
  //       }

  //       let endpoint = "";
  //       let method = "GET";
  //       let body = null;

  //       switch (type) {
  //         case "approve":
  //           endpoint = `https://api.backend.t-coin.saveneed.com/api/super-admin/${currentUser.id}/approve`;
  //           method = "POST";
  //           body = JSON.stringify({
  //             approveUserId: user.id,
  //             type: user.type,
  //             approveStatus: true,
  //           });
  //           break;
  //         case "delete":
  //           endpoint =
  //             user.type === "admin"
  //               ? `https://api.backend.t-coin.saveneed.com/api/admins/${user.id}`
  //               : `https://api.backend.t-coin.saveneed.com/api/agents/${user.id}`;
  //           method = "DELETE";
  //           break;
  //         case "toggle":
  //           endpoint = `https://api.backend.t-coin.saveneed.com/api/agents/${user.id}`;
  //           method = "PUT";
  //           body = JSON.stringify({
  //             canReceiveRemittanceList: !user.canReceiveRemittanceList,
  //           });
  //           break;
  //         case "assign":
  //           if (!selectedAdminId) throw new Error("Please select an admin");
  //           endpoint = `https://api.backend.t-coin.saveneed.com/api/agents/${user.id}`;
  //           method = "PUT";
  //           body = JSON.stringify({
  //             newAdminId: selectedAdminId,
  //           });
  //           break;
  //       }

  //       const response = await fetch(endpoint, {
  //         method,
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body,
  //       });

  //       if (!response.ok) {
  //         const errorData = await response.json().catch(() => ({}));
  //         throw new Error(errorData.message || "Action failed");
  //       }

  //       toast.success(
  //         type === "approve"
  //           ? `${user.type.toUpperCase()} approved successfully`
  //           : type === "delete"
  //           ? `${user.type.toUpperCase()} deleted successfully`
  //           : type === "toggle"
  //           ? `Remittance ${
  //               !user.canReceiveRemittanceList ? "enabled" : "disabled"
  //             } successfully`
  //           : "Admin assigned successfully"
  //       );
  //       onActionComplete?.();
  //     } catch (error) {
  //       console.error("Action error:", error);
  //       toast.error(
  //         error instanceof Error ? error.message : "Something went wrong"
  //       );
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const handleAction = async (
    type: "approve" | "delete" | "toggle" | "assign"
  ) => {
    setActionType(type);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("user");
      const currentUser = userStr ? JSON.parse(userStr) : null;

      if (!token || !currentUser?.id) {
        throw new Error("Authorization error. Please log in again.");
      }

      let endpoint = "";
      let method = "GET";
      let body = null;

      switch (type) {
        case "approve":
          endpoint = `https://api.backend.t-coin.saveneed.com/api/super-admin/${currentUser.id}/approve`;
          method = "POST";
          body = JSON.stringify({
            approveUserId: user.id,
            type: user.type,
            approveStatus: true,
          });
          break;
        case "delete":
          endpoint =
            user.type === "admin"
              ? `https://api.backend.t-coin.saveneed.com/api/admins/${user.id}`
              : `https://api.backend.t-coin.saveneed.com/api/agents/${user.id}`;
          method = "DELETE";
          break;
        case "toggle":
          endpoint = `https://api.backend.t-coin.saveneed.com/api/agents/${user.id}`;
          method = "PUT";
          body = JSON.stringify({
            canReceiveRemittanceList: !user.canReceiveRemittanceList,
          });
          break;
        case "assign":
          if (!selectedAdminId) throw new Error("Please select an admin");
          endpoint = `https://api.backend.t-coin.saveneed.com/api/agents/${user.id}`;
          method = "PUT";
          body = JSON.stringify({
            newAdminId: selectedAdminId,
          });
          break;
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Action failed");
      }

      // Call the appropriate callback after successful action
      switch (type) {
        case "approve":
          onUserUpdate?.({ isApproved: true });
          break;
        case "delete":
          onUserDelete?.(user.id);
          break;
        case "toggle":
          onUserUpdate?.({
            canReceiveRemittanceList: !user.canReceiveRemittanceList,
          });
          break;
        case "assign":
          // Handle admin assignment updates if needed
          break;
      }

      toast.success(
        type === "approve"
          ? `${user.type.toUpperCase()} approved successfully`
          : type === "delete"
          ? `${user.type.toUpperCase()} deleted successfully`
          : type === "toggle"
          ? `Remittance ${
              !user.canReceiveRemittanceList ? "enabled" : "disabled"
            } successfully`
          : "Admin assigned successfully"
      );
      onActionComplete?.();
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
          <Button
            variant="ghost"
            size="sm"
            className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - User Info */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {user.image && (
                  <div className="relative h-24 w-24 min-w-[6rem]">
                    <Image
                      src={user.image}
                      alt="User image"
                      fill
                      className="rounded-md object-cover"
                      unoptimized
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

            {/* Right Column - Documents */}
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            title="More actions"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Delete Action */}
          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DialogTrigger>
            <Dialog
              open={showDeleteConfirm}
              onOpenChange={setShowDeleteConfirm}
            >
              {/* <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </DialogTrigger> */}
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <p>
                  Are you sure you want to delete <strong>{user.name}</strong>?
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      handleAction("delete");
                    }}
                    disabled={isLoading && actionType === "delete"}
                  >
                    {isLoading && actionType === "delete" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Dialog>

          {/* Approve Action */}
          {!user.isApproved && (
            <DropdownMenuItem
              onClick={() => handleAction("approve")}
              disabled={isLoading && actionType === "approve"}
            >
              {isLoading && actionType === "approve" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Approve User
            </DropdownMenuItem>
          )}

          {/* Agent-specific Actions */}
          {user.type === "agent" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleAction("toggle")}
                disabled={isLoading && actionType === "toggle"}
              >
                {isLoading && actionType === "toggle" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : user.canReceiveRemittanceList ? (
                  <ToggleLeft className="mr-2 h-4 w-4" />
                ) : (
                  <ToggleRight className="mr-2 h-4 w-4" />
                )}
                {user.canReceiveRemittanceList
                  ? "Disable Remittance"
                  : "Enable Remittance"}
              </DropdownMenuItem>

              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={fetchAdmins}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Assign Admin
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Admin to Agent</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Assigning admin to: {user.name}
                      </p>
                      <Select
                        value={selectedAdminId}
                        onValueChange={setSelectedAdminId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an admin" />
                        </SelectTrigger>
                        <SelectContent>
                          {admins.length > 0 ? (
                            admins.map((admin) => (
                              <SelectItem key={admin.id} value={admin.id}>
                                {admin.full_name} ({admin.email})
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">
                              No admins available
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={() => handleAction("assign")}
                      disabled={
                        isLoading || !selectedAdminId || admins.length === 0
                      }
                      className="w-full"
                    >
                      {isLoading && actionType === "assign" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Assign Admin"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Action Buttons */}
      {/* <div className="flex flex-wrap gap-2">
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete <strong>{user.name}</strong>?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleAction("delete");
                }}
                disabled={isLoading && actionType === "delete"}
              >
                {isLoading && actionType === "delete" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {!user.isApproved && (
          <Button
            size="sm"
            className="bg-green-500 text-white hover:bg-green-600"
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

        {user.type === "agent" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
                onClick={fetchAdmins}
              >
                <Plus className="h-4 w-4 mr-2" />
                Assign Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Admin to Agent</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Assigning admin to: {user.name}
                  </p>
                  <Select
                    value={selectedAdminId}
                    onValueChange={setSelectedAdminId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an admin" />
                    </SelectTrigger>
                    <SelectContent>
                      {admins.length > 0 ? (
                        admins.map((admin) => (
                          <SelectItem key={admin.id} value={admin.id}>
                            {admin.full_name} ({admin.email})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground">
                          No admins available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => handleAction("assign")}
                  disabled={
                    isLoading || !selectedAdminId || admins.length === 0
                  }
                  className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
                >
                  {isLoading && actionType === "assign" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Assign Admin"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div> */}
    </div>
  );
}

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
          unoptimized
        />
      </div>
    </div>
  );
}
