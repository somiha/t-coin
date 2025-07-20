"use client";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "../data-table";
import type { Currency } from "./columns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type TCoinRateApiItem = {
  id: number;
  from_currency: string;
  rate: string;
  country: string;
};

export default function CurrencyPage() {
  const [currencyRates, setCurrencyRates] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Missing token");
      return;
    }

    fetch("https://api.t-coin.code-studio4.com/api/tcoin-rates", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          const formatted: Currency[] = resData.data.map(
            (item: TCoinRateApiItem) => ({
              id: item.id.toString(),
              name: item.from_currency,
              value: parseFloat(item.rate),
              country: item.country,
            })
          );
          setCurrencyRates(formatted);
        } else {
          console.error("Unexpected response format:", resData);
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
              <h1 className="text-2xl font-bold tracking-tight">
                Currency Rate
              </h1>
              <Link href="/currency-rate/add-currency">
                <Button className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90">
                  + Add Currency Rate
                </Button>
              </Link>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <DataTable columns={columns} data={currencyRates} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
