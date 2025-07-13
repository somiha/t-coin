"use client";

import { useEffect, useState } from "react";
import { categoryColumns, Category } from "./columns";
import { DataTable } from "./data-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CategoryApiResponse {
  id: number;
  name: string;
  games: Game[];
}

interface Game {
  id: number;
  title: string;
  details: string;
  link: string;
  image: string;
  priority: number;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Missing authToken");
      return;
    }

    fetch("http://api.t-coin.code-studio4.com/api/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const formatted: Category[] = (
            data.data as CategoryApiResponse[]
          ).map((item) => ({
            id: String(item.id),
            name: item.name,
            gameCount: item.games.length,
            // Include additional fields if needed
          }));
          setCategories(formatted);
        } else {
          console.error("Invalid category response", data);
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
              <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
              <Link href="/category/add-category">
                <Button className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90">
                  + Add Category
                </Button>
              </Link>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <DataTable columns={categoryColumns} data={categories} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
