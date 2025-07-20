"use client";

import { useEffect, useState } from "react";
import { objectColumns } from "./columns";
import { DataTable } from "../data-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Define all interfaces at the top
export interface Game {
  id: number;
  title: string;
  details: string;
  link: string;
  image: string;
  priority: number;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Add the missing GameTableData interface
export interface GameTableData {
  id: string;
  title: string;
  details: string;
  category: string;
  priority: number;
}

export default function ObjectsPage() {
  const [objects, setObjects] = useState<GameTableData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchObjects = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await fetch(
          "https://api.t-coin.code-studio4.com/api/objects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setObjects(
            data.data.map((obj: Game) => ({
              id: String(obj.id),
              title: obj.title,
              details: obj.details,
              category: obj.category?.name || "Uncategorized",
              priority: obj.priority,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching objects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">
                Game Objects
              </h1>
              <Link href="/object/add-object">
                <Button className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90">
                  + Add Object
                </Button>
              </Link>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <DataTable columns={objectColumns} data={objects} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
