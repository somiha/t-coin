"use client";

import { columns, User } from "./columns";
import { DataTable } from "../data-table";
import { useEffect, useState } from "react";

interface UserApiResponse {
  id: number;
  full_name: string;
  email: string;
  phone_no: string;
  country: string;
  address: string;
  avatar?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Missing authToken");
      return;
    }

    fetch("https://api.t-coin.code-studio4.com/api/users", {
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
        } else {
          console.error("Invalid API response", data);
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">All Users</h1>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <DataTable columns={columns} data={users} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
