"use client";

import { columns } from "./columns";
import { DataTable } from "../data-table";
import type { User } from "./columns";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ApiUser {
  id: number;
  full_name: string;
  email: string;
  phone_no: string;
  isApproved: boolean;
  type: "admin" | "agent";
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
  admin?: {
    id: number;
    name: string;
    type: string;
    email: string;
    image: string;
    phone_no: string;
    country: string;
    approve_status: boolean;
  } | null;
}

interface ApiResponse {
  success: boolean;
  data: {
    admins?: ApiUser[];
    agents?: ApiUser[];
  };
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<"admin" | "agent">("admin");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");
      const adminType = localStorage.getItem("adminType");

      if (!userStr || !token || !adminType) {
        throw new Error("Authorization error");
      }

      const user = JSON.parse(userStr);
      const response = await fetch(
        `https://api.backend.t-coin.saveneed.com/api/super-admin/user-list/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error("Failed to fetch users");
      }

      const allUsers = [
        ...(data.data.admins || []).map((u: ApiUser) => ({
          id: u.id.toString(),
          name: u.full_name,
          email: u.email,
          phone: u.phone_no,
          type: "admin" as const,
          isApproved: u.isApproved,
          canReceiveRemittanceList: u.canReceiveRemittanceList || false,
          image: u.image,
          address: u.address,
          city: u.city,
          country: u.country,
          state: u.state,
          zip_code: u.zip_code,
          nid_card_number: u.nid_card_number,
          nid_card_front_pic_url: u.nid_card_front_pic_url,
          nid_card_back_pic_url: u.nid_card_back_pic_url,
          passport_file_url: u.passport_file_url,
          qr_code: u.qr_code,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
          tcoin_balance: u.tcoin_balance,
          local_currency_balance: u.local_currency_balance,
          accepted_terms: u.accepted_terms,
          birth_date: u.birth_date,
          institution_name: u.institution_name,
          admin: {
            id: u.admin?.id || 0,
            name: u.admin?.name || "",
            type: u.admin?.type || "",
            email: u.admin?.email || "",
            image: u.admin?.image || "",
            phone_no: u.admin?.phone_no || "",
            country: u.admin?.country || "",
            approve_status: u.admin?.approve_status || false,
          },
        })),
        ...(data.data.agents || []).map((u: ApiUser) => ({
          id: u.id.toString(),
          name: u.full_name,
          email: u.email,
          phone: u.phone_no,
          type: "agent" as const,
          isApproved: u.isApproved,
          canReceiveRemittanceList: u.canReceiveRemittanceList || false,
          image: u.image,
          address: u.address,
          city: u.city,
          country: u.country,
          state: u.state,
          zip_code: u.zip_code,
          nid_card_number: u.nid_card_number,
          nid_card_front_pic_url: u.nid_card_front_pic_url,
          nid_card_back_pic_url: u.nid_card_back_pic_url,
          passport_file_url: u.passport_file_url,
          qr_code: u.qr_code,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
          tcoin_balance: u.tcoin_balance,
          local_currency_balance: u.local_currency_balance,
          accepted_terms: u.accepted_terms,
          birth_date: u.birth_date,
          institution_name: u.institution_name,
          admin: {
            id: u.admin?.id || 0,
            name: u.admin?.name || "",
            type: u.admin?.type || "",
            email: u.admin?.email || "",
            image: u.admin?.image || "",
            phone_no: u.admin?.phone_no || "",
            country: u.admin?.country || "",
            approve_status: u.admin?.approve_status || false,
          },
        })),
      ];
      setUsers(allUsers);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  };

  // Properly type the delete function
  const deleteUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // const filteredUsers = users.filter((user) => user.type === activeTab);

  const filteredUsers = users
    .filter((user) => user.type === activeTab)
    .filter((user) => {
      const query = searchQuery.toLowerCase();
      return (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query) ||
        user.country?.toLowerCase().includes(query) ||
        user.state?.toLowerCase().includes(query) ||
        user.city?.toLowerCase().includes(query) ||
        user.zip_code?.toLowerCase().includes(query) ||
        user.birth_date?.toLowerCase().includes(query) ||
        user.address?.toLowerCase().includes(query) ||
        user.institution_name?.toLowerCase().includes(query) ||
        user.qr_code?.toLowerCase().includes(query) ||
        user.nid_card_number?.toLowerCase().includes(query)
      );
    });

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">
                Admin Management
              </h1>
              <Link href="/admins/add-admin">
                <Button className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90">
                  + Add Admin
                </Button>
              </Link>
            </div>

            <div className="mb-4">
              <div className="mb-4 relative">
                <Input
                  placeholder="Search Admin or Agent by name, phone, email, etc."
                  className="max-w-sm pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <Search className="absolute p-1 h-6 w-6 text-gray-400 left-2 top-2" />
              </div>
            </div>

            <Tabs
              defaultValue="admin"
              onValueChange={(value) =>
                setActiveTab(value as "admin" | "agent")
              }
              className="w-full"
            >
              <TabsList className="grid w-6/12 grid-cols-2">
                <TabsTrigger value="admin">Admins</TabsTrigger>
                <TabsTrigger value="agent">Agents</TabsTrigger>
              </TabsList>

              <TabsContent value="admin">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <p>Loading admins...</p>
                  </div>
                ) : error ? (
                  <div className="text-red-500 p-4">{error}</div>
                ) : (
                  <DataTable columns={columns} data={filteredUsers} />
                )}
              </TabsContent>

              <TabsContent value="agent">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <p>Loading agents...</p>
                  </div>
                ) : error ? (
                  <div className="text-red-500 p-4">{error}</div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredUsers}
                    meta={{
                      updateUser,
                      deleteUser,
                      refetchData: fetchUsers, // Optional: if you want to support refreshing
                    }}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
