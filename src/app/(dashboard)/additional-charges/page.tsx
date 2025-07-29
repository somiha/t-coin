"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface ChargeConfig {
  id: number;
  sendChargePer1000TCoin: string;
  cashOutChargePer1000TCoin: string;
  userCashInBonusPerTransaction: string;
  agentCashOutPercentage: string;
  superAdminCashOutPercentage: string;
  superAdminSendMoneyPercentage: string;
}

export default function ChargesManagement() {
  const [charges, setCharges] = useState<ChargeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCharges = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(
          "https://api.t-coin.code-studio4.com/api/charges",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCharges(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCharges();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (charges) {
      setCharges({
        ...charges,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token missing");
      }

      if (!charges) {
        throw new Error("No charges data to update");
      }

      const payload = {
        sendChargePer1000TCoin: parseFloat(charges.sendChargePer1000TCoin),
        cashOutChargePer1000TCoin: parseFloat(
          charges.cashOutChargePer1000TCoin
        ),
        userCashInBonusPerTransaction: parseFloat(
          charges.userCashInBonusPerTransaction
        ),
        agentCashOutPercentage: parseFloat(charges.agentCashOutPercentage),
        superAdminCashOutPercentage: parseFloat(
          charges.superAdminCashOutPercentage
        ),
        superAdminSendMoneyPercentage: parseFloat(
          charges.superAdminSendMoneyPercentage
        ),
      };

      const response = await fetch(
        "https://api.t-coin.code-studio4.com/api/charges/upsert",
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
        throw new Error(result.message || "Failed to update charges");
      }

      alert("Charges updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Charges Configuration</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Charges</Button>
        )}
      </div>

      <Card className="w-full">
        <CardContent className="p-6">
          {charges ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Send Charge */}
                <div className="space-y-2">
                  <Label htmlFor="sendChargePer1000TCoin">
                    Send Charge (per 1000 TCoin)
                  </Label>
                  <Input
                    id="sendChargePer1000TCoin"
                    name="sendChargePer1000TCoin"
                    value={charges.sendChargePer1000TCoin}
                    onChange={handleChange}
                    disabled={!isEditing}
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Cash Out Charge */}
                <div className="space-y-2">
                  <Label htmlFor="cashOutChargePer1000TCoin">
                    Cash Out Charge (per 1000 TCoin)
                  </Label>
                  <Input
                    id="cashOutChargePer1000TCoin"
                    name="cashOutChargePer1000TCoin"
                    value={charges.cashOutChargePer1000TCoin}
                    onChange={handleChange}
                    disabled={!isEditing}
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* User Cash In Bonus */}
                <div className="space-y-2">
                  <Label htmlFor="userCashInBonusPerTransaction">
                    User Cash In Bonus (per transaction)
                  </Label>
                  <Input
                    id="userCashInBonusPerTransaction"
                    name="userCashInBonusPerTransaction"
                    value={charges.userCashInBonusPerTransaction}
                    onChange={handleChange}
                    disabled={!isEditing}
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Agent Cash Out Percentage */}
                <div className="space-y-2">
                  <Label htmlFor="agentCashOutPercentage">
                    Agent Cash Out Percentage
                  </Label>
                  <Input
                    id="agentCashOutPercentage"
                    name="agentCashOutPercentage"
                    value={charges.agentCashOutPercentage}
                    onChange={handleChange}
                    disabled={!isEditing}
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                  />
                </div>

                {/* Super Admin Cash Out Percentage */}
                <div className="space-y-2">
                  <Label htmlFor="superAdminCashOutPercentage">
                    Super Admin Cash Out Percentage
                  </Label>
                  <Input
                    id="superAdminCashOutPercentage"
                    name="superAdminCashOutPercentage"
                    value={charges.superAdminCashOutPercentage}
                    onChange={handleChange}
                    disabled={!isEditing}
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                  />
                </div>

                {/* Super Admin Send Money Percentage */}
                <div className="space-y-2">
                  <Label htmlFor="superAdminSendMoneyPercentage">
                    Super Admin Send Money Percentage
                  </Label>
                  <Input
                    id="superAdminSendMoneyPercentage"
                    name="superAdminSendMoneyPercentage"
                    value={charges.superAdminSendMoneyPercentage}
                    onChange={handleChange}
                    disabled={!isEditing}
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          ) : (
            <div className="text-center py-8">
              <p>No charges configuration found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
