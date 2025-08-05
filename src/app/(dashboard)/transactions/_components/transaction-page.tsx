"use client";

import { DataTable } from "../../data-table";
import { TransactionFilter } from "./transaction-filter";
import { columns } from "../columns";
import { useEffect, useState } from "react";
import { subDays, isWithinInterval } from "date-fns";
import { Transaction } from "../columns";

interface TransactionsPageProps {
  title: string;
  apiEndpoint: string;
}

interface ApiTransaction {
  id: number;
  type: string;
  transaction_type: string;
  amount: string;
  local_currency_amount: string;
  transaction_date: string;
  transaction_status?: string;
  agent_id?: number | null;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  receiver_nid?: string;
  sender_nid?: string | null;
  method_type?: string | null;
  method_label?: string;
  receiver_number?: string | null;
  bank_name?: string | null;
  bank_branch_name?: string | null;
  account_holder_name?: string | null;
  account_number?: string | null;
  account_holder_mobile_number?: string | null;
  sender_image_url?: string | null;
  receiver_image_url?: string | null;
  sender_name?: string | null;
  receiver_name?: string | null;
  user?: {
    id: number;
  };
}

interface ApiResponse {
  success: boolean;
  data: ApiTransaction[];
  message?: string;
}

export function TransactionsPage({
  title,
  apiEndpoint,
}: TransactionsPageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterRange, setFilterRange] = useState("all");
  const [customFrom, setCustomFrom] = useState<Date | null>(null);
  const [customTo, setCustomTo] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Missing authToken");
        }

        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.t-coin.code-studio4.com/api/transaction-history/${apiEndpoint}`,
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

        if (!data.success || !Array.isArray(data.data)) {
          throw new Error(data.message || "Invalid API response structure");
        }

        // Transform API data to match Transaction type
        const transformedData: Transaction[] = data.data.map((item) => ({
          id: item.id,
          name: item.receiver_name || item.sender_name || "N/A",
          image:
            item.receiver_image_url ||
            item.sender_image_url ||
            "/person-fill.png",
          method: item.method_type || "N/A",
          type: item.type || "N/A",
          transaction_type: item.transaction_type || "N/A",
          amount: item.amount,
          charge: parseFloat(item.local_currency_amount || "0"),
          date: item.transaction_date,
          transaction_status: item.transaction_status,
          description: item.description,
          receiver_nid: item.receiver_nid,
          sender_nid: item.sender_nid || undefined,
          method_label: item.method_label,
          bank_name: item.bank_name || undefined,
          bank_branch_name: item.bank_branch_name || undefined,
          account_holder_name: item.account_holder_name || undefined,
          account_number: item.account_number || undefined,
          account_holder_mobile_number:
            item.account_holder_mobile_number || undefined,

          sender_name: item.sender_name || undefined,
          receiver_name: item.receiver_name || undefined,
          sender_image_url: item.sender_image_url || undefined,
          receiver_image_url: item.receiver_image_url || undefined,

          local_currency_amount: item.local_currency_amount || undefined,
        }));

        setTransactions(transformedData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [apiEndpoint]);

  const filteredTransactions =
    filterRange === "all"
      ? transactions
      : transactions.filter((item) => {
          const itemDate = new Date(item.date);
          switch (filterRange) {
            case "last7":
              return isWithinInterval(itemDate, {
                start: subDays(today, 7),
                end: today,
              });
            case "last14":
              return isWithinInterval(itemDate, {
                start: subDays(today, 14),
                end: today,
              });
            case "last30":
              return isWithinInterval(itemDate, {
                start: subDays(today, 30),
                end: today,
              });
            case "last365":
              return isWithinInterval(itemDate, {
                start: subDays(today, 365),
                end: today,
              });
            case "custom":
              if (customFrom && customTo) {
                return isWithinInterval(itemDate, {
                  start: customFrom,
                  end: customTo,
                });
              }
              return true;
            default:
              return true;
          }
        });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              <TransactionFilter
                filterRange={filterRange}
                setFilterRange={setFilterRange}
                customFrom={customFrom}
                setCustomFrom={setCustomFrom}
                customTo={customTo}
                setCustomTo={setCustomTo}
              />
            </div>
            <DataTable columns={columns} data={filteredTransactions} />
          </div>
        </main>
      </div>
    </div>
  );
}
