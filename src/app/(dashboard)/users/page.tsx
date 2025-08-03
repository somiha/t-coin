"use client";

import { columns, User } from "./columns";
import { DataTable } from "../data-table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Megaphone, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface UserApiResponse {
  id: number;
  full_name: string;
  email: string;
  phone_no: string;
  country: string;
  address: string;
  avatar?: string;

  // Add more optional fields as needed
  state?: string;
  city?: string;
  zip_code?: string;
  latitude?: string;
  longitude?: string;
  institution_name?: string;
  birth_date?: string;
  tcoin_balance?: string;
  local_currency_balance?: string;
  tcoin_withdrawal?: string;
  deviceToken?: string;
  image?: string;
  user_code?: string;
  qr_code?: string;
  passport_file_url?: string;
  nid_card_number?: string;
  nid_card_front_pic_url?: string;
  nid_card_back_pic_url?: string;
  referral_code?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Missing authToken");
      return;
    }

    fetch("https://api.backend.t-coin.saveneed.com/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data.map(
            (user: UserApiResponse): User => ({
              id: String(user.id),
              name: user.full_name || "N/A",
              email: user.email || "N/A",
              phone: user.phone_no || "N/A",
              country: user.country || "N/A",
              address: user.address || "N/A",
              avatar: user.avatar || "/default-avatar.png",
            })
          );
          setUsers(formatted);
          setFilteredUsers(formatted);
        } else {
          console.error("Invalid API response", data);
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const result = users.filter((user) =>
      Object.values(user).some((value) =>
        value?.toString().toLowerCase().includes(q)
      )
    );
    setFilteredUsers(result);
  }, [searchQuery, users]);

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSendingBroadcast(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Missing authToken");
      }

      const response = await fetch(
        `https://api.backend.t-coin.saveneed.com/api/notifications/broadcast`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: broadcastMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send broadcast");
      }

      toast.success("Broadcast message sent successfully!");
      setIsDialogOpen(false);
      setBroadcastMessage("");
    } catch (error) {
      toast.error("Failed to send broadcast message");
      console.error("Broadcast error:", error);
    } finally {
      setIsSendingBroadcast(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">All Users</h1>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90">
                    <Megaphone className="h-4 w-4" />
                    Broadcast Notification
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Broadcast Notification</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <Textarea
                      placeholder="Enter your broadcast message"
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                    />
                    <Button
                      onClick={handleBroadcast}
                      disabled={isSendingBroadcast}
                      className="w-full"
                    >
                      {isSendingBroadcast ? "Sending..." : "Send Broadcast"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* 🔍 Search Input */}
            <div className="mb-4 relative">
              <Input
                placeholder="Search by any field..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm pl-10"
              />
              <Search className="absolute p-1 h-6 w-6 text-gray-400 left-2 top-2" />
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <DataTable columns={columns} data={filteredUsers} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
