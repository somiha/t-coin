"use client";

import { useEffect, useState } from "react";
import { columns, Banner } from "./columns";
import { DataTable } from "./data-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BannerApiResponse {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Missing authToken");
      return;
    }

    fetch("https://api.t-coin.code-studio4.com/api/banners", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const formatted: Banner[] = data.data.map(
            (item: BannerApiResponse) => ({
              id: String(item.id),
              image: item.image,
              title: item.title,
              description: item.description,
              link: item.link,
              active: item.active,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            })
          );
          setBanners(formatted);
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
              <h1 className="text-2xl font-bold tracking-tight">Banners</h1>
              <Link href="/banners/add-banner">
                <Button className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90">
                  + Add Banner
                </Button>
              </Link>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <DataTable columns={columns} data={banners} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
