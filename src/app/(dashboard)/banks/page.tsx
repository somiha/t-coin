"use client";

import { useEffect, useState } from "react";
import { bankColumns } from "./columns";
import { DataTable } from "../data-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// types/bank.ts
export interface Bank {
  id: number;
  name: string;
  type: "mobile" | "bank";
  country: string;
  supported_methods: string[];
  active: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankTableData {
  id: string;
  name: string;
  type: string;
  country: string;
  methods: string;
  active: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export default function BanksPage() {
  const [banks, setBanks] = useState<BankTableData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanks = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await fetch(
          "https://api.t-coin.code-studio4.com/api/bank",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();

        if (data.success && data.data?.banks) {
          setBanks(
            data.data.banks.map((bank: Bank) => ({
              id: String(bank.id),
              name: bank.name,
              type: bank.type,
              country: bank.country,
              methods: bank.supported_methods.join(", "),
              active: bank.active,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching banks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Banks</h1>
              <Link href="/banks/add-bank">
                <Button className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90">
                  + Add Bank
                </Button>
              </Link>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <DataTable columns={bankColumns} data={banks} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
