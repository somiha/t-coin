"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Admin {
  id: number;
  type: string;
  full_name: string;
  email: string;
  country: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    admins: Admin[];
  };
}

interface ExchangeFormData {
  adminId: string;
  superAdminId: string;
  amountInMoney: string;
  adminCountry: string;
}

export default function ExchangeMoneyToTCoin() {
  const router = useRouter();
  const [adminList, setAdminList] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<ExchangeFormData>({
    adminId: "",
    superAdminId: "",
    amountInMoney: "",
    adminCountry: "",
  });

  useEffect(() => {
    const fetchAdminList = async () => {
      try {
        setLoading(true);
        setError("");

        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("authToken");

        if (!userStr || !token) {
          throw new Error("Authentication required");
        }

        const user = JSON.parse(userStr);
        const response = await fetch(
          `https://api.backend.t-coin.saveneed.com/api/super-admin/user-list/${user.id}`,
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

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch admin list");
        }

        // Update this line to access data.admins instead of data.data
        setAdminList(Array.isArray(data.data?.admins) ? data.data.admins : []);

        const adminType = localStorage.getItem("adminType");

        const userId = user.id;
        console.log("Admin Type:", userId);

        if (adminType === "super_admin") {
          setForm((prev) => ({
            ...prev,
            superAdminId: userId,
          }));
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setAdminList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminList();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    const selectedAdmin = adminList.find(
      (admin) => admin.id.toString() === value
    );

    setForm((prev) => ({
      ...prev,
      adminId: value,
      adminCountry: selectedAdmin?.country || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!form.adminId || !form.amountInMoney || !form.adminCountry) {
      alert("Please fill all required fields");
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token missing");
      }

      const response = await fetch(
        "https://api.backend.t-coin.saveneed.com/exchange-admin-money-to-tcoin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            adminId: parseInt(form.adminId),
            superAdminId: parseInt(form.superAdminId),
            amountInMoney: parseFloat(form.amountInMoney),
            adminCountry: form.adminCountry,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to process exchange");
      }

      alert("Exchange successful!");
      router.push("/admin-money-to-tcoin");
    } catch (error) {
      console.error("Exchange error:", error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">Exchange Money to TCoin</h2>
      <Card className="w-full">
        <CardContent className="p-6 space-y-6 lg:pl-16 md:pl-1">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[600px] space-y-4"
          >
            {/* Admin Selection */}
            <div className="space-y-2">
              <Label htmlFor="admin-select">Select Admin *</Label>
              {adminList.length > 0 ? (
                <Select
                  onValueChange={handleSelectChange}
                  value={form.adminId}
                  required
                >
                  <SelectTrigger id="admin-select">
                    <SelectValue placeholder="Select an admin" />
                  </SelectTrigger>
                  <SelectContent>
                    {adminList.map((admin) => (
                      <SelectItem key={admin.id} value={admin.id.toString()}>
                        {admin.full_name} ({admin.email}) - {admin.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No admins available. Please check back later.
                </div>
              )}
            </div>

            {/* Super Admin ID (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="superAdminId">Super Admin ID</Label>
              <Input
                id="superAdminId"
                name="superAdminId"
                value={form.superAdminId}
                onChange={handleChange}
                readOnly
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amountInMoney">Amount in Money *</Label>
              <Input
                id="amountInMoney"
                name="amountInMoney"
                type="number"
                placeholder="Enter amount"
                value={form.amountInMoney}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="adminCountry">Admin Country *</Label>
              <Input
                id="adminCountry"
                name="adminCountry"
                placeholder="Country"
                value={form.adminCountry}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white w-full"
              size="md"
              type="submit"
              disabled={submitting || adminList.length === 0}
            >
              {submitting ? "Processing..." : "Exchange to TCoin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
