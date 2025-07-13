"use client";

import { useEffect, useState } from "react";
import { columns, Transaction } from "./columns";
import { DataTable } from "./data-table";

interface TransactionApiResponse {
  id: number;
  transaction_type: string;
  amount: string;
  local_currency_amount: string;
  transaction_date: string;
  method_type: string | null;
  method_label: string;
  sender_name: string | null;
  receiver_name: string | null;
  sender_image_url: string | null;
  receiver_image_url: string | null;
  transaction_status?: string;
  description?: string;
  receiver_nid?: string;
  sender_nid?: string;
  bank_name?: string;
  bank_branch_name?: string;
  account_holder_name?: string;
  account_number?: string;
  account_holder_mobile_number?: string;
  user: {
    id: number;
  };
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Missing authToken");
      return;
    }

    fetch("http://api.t-coin.code-studio4.com/api/transaction-history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data.map(
            (t: TransactionApiResponse): Transaction => ({
              id: t.id,
              name: t.receiver_name || t.sender_name || "N/A",
              image:
                t.receiver_image_url ||
                t.sender_image_url ||
                "/person-fill.png",
              method: t.method_type || "N/A",
              type: t.transaction_type || "N/A",
              amount: t.amount,
              charge: parseFloat(t.local_currency_amount || "0"),
              date: t.transaction_date,

              // Additional fields for modal view
              transaction_status: t.transaction_status,
              description: t.description,
              receiver_nid: t.receiver_nid,
              sender_nid: t.sender_nid,
              method_label: t.method_label,
              bank_name: t.bank_name,
              bank_branch_name: t.bank_branch_name,
              account_holder_name: t.account_holder_name,
              account_number: t.account_number,
              account_holder_mobile_number: t.account_holder_mobile_number,
            })
          );

          setTransactions(formatted);
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
              <h1 className="text-2xl font-bold tracking-tight">
                All Transactions
              </h1>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <DataTable columns={columns} data={transactions} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
