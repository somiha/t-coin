"use client";

import { DataTable } from "../../data-table";
import { TransactionFilter } from "./transaction-filter";
import { columns } from "../columns";
import { useEffect, useState } from "react";
import { subDays, isWithinInterval } from "date-fns";
import { Transaction } from "../columns";

interface TransactionsTableProps {
  type?: string;
  apiEndpoint?: string;
  title?: string;
}

interface ApiTransaction {
  id: number;
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

export function TransactionsTable({
  type,
  apiEndpoint,
  title = "Transactions",
}: TransactionsTableProps) {
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

        let url = "https://api.t-coin.code-studio4.com/api/transaction-history";
        if (type) {
          url += `/filter?type=${encodeURIComponent(type)}`;
        } else if (apiEndpoint) {
          url += `/${apiEndpoint}`;
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (!data.success || !Array.isArray(data.data)) {
          throw new Error(data.message || "Invalid API response structure");
        }

        // Transform API data to match Transaction type with all details
        const transformedData: Transaction[] = data.data.map((item) => ({
          id: item.id,
          name: item.receiver_name || item.sender_name || "N/A",
          image:
            item.receiver_image_url ||
            item.sender_image_url ||
            "/person-fill.png",
          method: item.method_type || "N/A",
          type: item.transaction_type || "N/A",
          amount: item.amount,
          charge: parseFloat(item.local_currency_amount || "0"),
          date: item.transaction_date || "N/A",
          transaction_status: item.transaction_status || "N/A",
          description: item.description || "N/A",
          receiver_nid: item.receiver_nid || "N/A",
          sender_nid: item.sender_nid || "N/A",
          method_label: item.method_label,
          bank_name: item.bank_name || "N/A",
          bank_branch_name: item.bank_branch_name || "N/A",
          account_holder_name: item.account_holder_name || "N/A",
          account_number: item.account_number || "N/A",
          account_holder_mobile_number:
            item.account_holder_mobile_number || "N/A",
          sender_name: item.sender_name || "N/A",
          receiver_name: item.receiver_name || "N/A",
          sender_image_url: item.sender_image_url || "/person-fill.png",
          receiver_image_url: item.receiver_image_url || "/person-fill.png",
          transaction_type: item.transaction_type || "N/A",
          local_currency_amount: item.local_currency_amount || "N/A",
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
  }, [type, apiEndpoint]);

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {title && (
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        )}
        <div className="ml-auto">
          <TransactionFilter
            filterRange={filterRange}
            setFilterRange={setFilterRange}
            customFrom={customFrom}
            setCustomFrom={setCustomFrom}
            customTo={customTo}
            setCustomTo={setCustomTo}
          />
        </div>
      </div>
      <DataTable columns={columns} data={filteredTransactions} />
    </div>
  );
}
