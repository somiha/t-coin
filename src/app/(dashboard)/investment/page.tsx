"use client";

import { columns } from "./columns";
import { DataTable } from "../data-table";
import type { Investment } from "./columns";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface InvestmentApiResponse {
  id: number;
  title: string;
  description: string;
  total_needed: string;
  total_invested: string;
  profit_or_loss: string;
  hide_status: boolean;
  active_status: boolean;
  refund_status: boolean;
  image: string;
  createdAt: string;
}

export default function InvestmentPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Missing token");
      return;
    }

    fetch("https://api.backend.t-coin.saveneed.com/api/investment-projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const formatted: Investment[] = data.data.map(
            (item: InvestmentApiResponse) => ({
              id: item.id.toString(),
              title: item.title,
              description: item.description,
              total_needed: item.total_needed,
              total_invested: item.total_invested,
              profit_or_loss: item.profit_or_loss,
              hide_status: item.hide_status,
              active_status: item.active_status,
              refund_status: item.refund_status,
              image: item.image,
              createdAt: item.createdAt,
            })
          );
          setInvestments(formatted);
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Investments</h1>
              <Link href="/investment/add-investment">
                <Button className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90">
                  + Add Investment
                </Button>
              </Link>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <DataTable columns={columns} data={investments} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
