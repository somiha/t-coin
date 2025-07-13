"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import type { Admin } from "./columns";
import { useEffect, useState } from "react";

interface AdminApiResponse {
  id: number;
  full_name: string;
  email: string;
  phone_no: string;
  isApproved: boolean;
  type: string;
  image?: string | null;
}

export default function Page() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");
    const adminType = localStorage.getItem("adminType");

    if (!userStr || !token || !adminType) {
      console.error("Missing user/token/adminType");
      return;
    }
    const user = JSON.parse(userStr);
    const url = `http://api.t-coin.code-studio4.com/api/super-admin/user-list/${user.id}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.admins) {
          const formatted: Admin[] = data.data.admins.map(
            (admin: AdminApiResponse) => ({
              id: admin.id.toString(),
              name: admin.full_name,
              email: admin.email,
              phone: admin.phone_no,
              type: admin.type,
              isApproved: admin.isApproved,
            })
          );
          setAdmins(formatted);
        }
        console.log(data);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold tracking-tight">All Admins</h1>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <DataTable columns={columns} data={admins} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
