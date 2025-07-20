"use client";

import { columns } from "./columns";
import { DataTable } from "../data-table";
import type { User } from "./columns";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ApiUser {
  id: number;
  full_name: string;
  email: string;
  phone_no: string;
  isApproved: boolean;
  type: "admin" | "agent";
  image?: string | null;
  canReceiveRemittanceList?: boolean;
}

interface ApiResponse {
  success: boolean;
  data: {
    admins?: ApiUser[];
    agents?: ApiUser[];
  };
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");
      const adminType = localStorage.getItem("adminType");

      if (!userStr || !token || !adminType) {
        console.error("Missing credentials");
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userStr);
        const response = await fetch(
          `https://api.t-coin.code-studio4.com/api/super-admin/user-list/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data: ApiResponse = await response.json();
        if (data.success && data.data) {
          const allUsers = [
            ...(data.data.admins || []),
            ...(data.data.agents || []),
          ].map(
            (user): User => ({
              id: user.id.toString(),
              name: user.full_name,
              email: user.email,
              phone: user.phone_no,
              type: user.type,
              isApproved: user.isApproved,
              canReceiveRemittance: user.canReceiveRemittanceList || false,
            })
          );
          setUsers(allUsers);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">
                All Admins and Agents
              </h1>
              <Link href="/admins/add-admin">
                <Button className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90">
                  + Add Admin
                </Button>
              </Link>
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p>Loading users...</p>
              </div>
            ) : (
              <DataTable columns={columns} data={users} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
