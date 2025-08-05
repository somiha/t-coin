"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ExchangeTCoinToMoney() {
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);

  // Load balance from localStorage
  useEffect(() => {
    updateBalanceFromLocalStorage();
  }, []);

  const updateBalanceFromLocalStorage = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    setBalance(user?.tcoin_balance ? parseFloat(user.tcoin_balance) : 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");
      const adminType = localStorage.getItem("adminType");

      if (!userStr || !token) {
        throw new Error("Authentication required");
      }

      const user = JSON.parse(userStr);
      const amountInTcoin = parseFloat(amount);

      if (isNaN(amountInTcoin) || amountInTcoin <= 0) {
        throw new Error("Please enter a valid amount");
      }

      if (amountInTcoin > balance) {
        throw new Error("Insufficient TCoin balance");
      }

      const payload = {
        adminId: user.id,
        superAdminId: adminType === "super_admin" ? user.id : 1,
        amountInTcoin,
        adminCountry: user.country || "Bangladesh",
      };

      const response = await fetch(
        "https://api.t-coin.code-studio4.com/exchange-admin-tcoin-to-money",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Exchange failed");
      }

      // Update local storage and state immediately
      if (result.data?.user) {
        localStorage.setItem("user", JSON.stringify(result.data.user));
        setBalance(parseFloat(result.data.user.tcoin_balance));
      } else {
        // Fallback calculation if API doesn't return updated user
        const newBalance = balance - amountInTcoin;
        const updatedUser = {
          ...user,
          tcoin_balance: newBalance.toFixed(2),
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setBalance(newBalance);
      }

      toast.success("Exchange successful!");
      setAmount("");
    } catch (error) {
      console.error("Exchange error:", error);
      toast.error(error instanceof Error ? error.message : "Exchange failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 my-2">
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Your TCoin Balance
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {balance.toFixed(2)} TCoin
            </p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
              <path d="M12 18V6" />
            </svg>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount to Exchange</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter TCoin amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={submitting || !amount}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Exchange Now"
          )}
        </Button>
      </form>
    </div>
  );
}
