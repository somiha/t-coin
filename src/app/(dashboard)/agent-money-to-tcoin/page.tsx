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

interface Agent {
  id: number;
  type: string;
  full_name: string;
  email: string;
  country: string;
  phone_no: string;
  isApproved: boolean;
  canReceiveRemittanceList: boolean;
  admin: {
    id: number;
    full_name: string;
    email: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: Agent[]; // Changed from data.agents to direct array
}

interface ExchangeFormData {
  agentId: string;
  adminId: string;
  amountInMoney: string;
  agentCountry: string;
}

export default function ExchangeAgentMoneyToTCoin() {
  const router = useRouter();
  const [agentList, setAgentList] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<ExchangeFormData>({
    agentId: "",
    adminId: "",
    amountInMoney: "",
    agentCountry: "",
  });

  useEffect(() => {
    const fetchAgentList = async () => {
      try {
        setLoading(true);
        setError("");

        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("authToken");

        if (!userStr || !token) {
          throw new Error("Authentication required");
        }

        const user = JSON.parse(userStr);
        console.log("Fetching agents for admin ID:", user.id); // Debug log

        const response = await fetch(
          `https://api.t-coin.code-studio4.com/api/admins/${user.id}/agents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response status:", response.status); // Debug log

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        console.log("API response data:", data); // Debug log

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch agent list");
        }

        // Updated to handle direct array response
        const agents = Array.isArray(data.data) ? data.data : [];
        console.log("Agents fetched:", agents); // Debug log

        setAgentList(agents);
        setForm((prev) => ({
          ...prev,
          adminId: user.id.toString(),
          // Auto-select first agent if only one exists
          ...(agents.length === 1
            ? {
                agentId: agents[0].id.toString(),
                agentCountry: agents[0].country || "",
              }
            : {}),
        }));
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setAgentList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentList();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    const selectedAgent = agentList.find(
      (agent) => agent.id.toString() === value
    );
    setForm((prev) => ({
      ...prev,
      agentId: value,
      agentCountry: selectedAgent?.country || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!form.agentId || !form.amountInMoney || !form.agentCountry) {
      alert("Please fill all required fields");
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token missing");
      }

      const payload = {
        agentId: parseInt(form.agentId),
        adminId: parseInt(form.adminId),
        amountInMoney: parseFloat(form.amountInMoney),
        agentCountry: form.agentCountry,
      };

      console.log("Submitting payload:", payload); // Debug log

      const response = await fetch(
        "https://api.t-coin.code-studio4.com/exchange-agent-money-to-tcoin",
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
      console.log("Exchange response:", result); // Debug log

      if (!response.ok) {
        throw new Error(result.message || "Failed to process exchange");
      }

      alert("Exchange successful!");
      router.push("/agents");
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
      <h2 className="text-xl font-semibold mb-4">
        Exchange Money to TCoin (Agent)
      </h2>
      <Card className="w-full">
        <CardContent className="p-6 space-y-6 lg:pl-16 md:pl-1">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[600px] space-y-4"
          >
            {/* Agent Selection */}
            <div className="space-y-2">
              <Label htmlFor="agent-select">Select Agent *</Label>
              {agentList.length > 0 ? (
                <Select
                  onValueChange={handleSelectChange}
                  value={form.agentId}
                  required
                >
                  <SelectTrigger id="agent-select">
                    <SelectValue placeholder="Select an agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agentList.map((agent) => (
                      <SelectItem
                        key={agent.id}
                        value={agent.id.toString()}
                        disabled={
                          !agent.isApproved || !agent.canReceiveRemittanceList
                        }
                      >
                        <div className="flex items-center gap-2">
                          <span>
                            {agent.full_name} ({agent.email}) - {agent.country}
                          </span>
                          {(!agent.isApproved ||
                            !agent.canReceiveRemittanceList) && (
                            <span className="text-xs text-muted-foreground">
                              {!agent.isApproved
                                ? "(Not Approved)"
                                : "(Cannot Receive Remittance)"}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No agents available. Please check back later.
                </div>
              )}
            </div>

            {/* Admin ID (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="adminId">Admin ID</Label>
              <Input
                id="adminId"
                name="adminId"
                value={form.adminId}
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
              <Label htmlFor="agentCountry">Agent Country *</Label>
              <Input
                id="agentCountry"
                name="agentCountry"
                placeholder="Country"
                value={form.agentCountry}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white w-full"
              size="md"
              type="submit"
              disabled={submitting || agentList.length === 0 || !form.agentId}
            >
              {submitting ? "Processing..." : "Exchange to TCoin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
