"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface FormData {
  fromEntityId: string;
  fromEntityType: string;
  toEntityId: string;
  toEntityType: string;
  oprationType: string;
  amountType: string;
  amount: string;
  country: string;
  description: string;
  note: string;
  image: File | null;
}

export default function TCoinOperationForm() {
  const [form, setForm] = useState<FormData>({
    fromEntityId: "",
    fromEntityType: "",
    toEntityId: "1",
    toEntityType: "super_admin",
    oprationType: "REQUEST_DEDUCTION",
    amountType: "TCOIN",
    amount: "",
    country: "",
    description: "",
    note: "",
    image: null,
  });

  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem("adminType") || "";
    const userId = localStorage.getItem("user") || "";

    const user = JSON.parse(userId);

    setForm((prev) => ({
      ...prev,
      fromEntityId: user.id,
      fromEntityType: userType,
    }));

    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setCountries(["Bangladesh", "USA", "UK"]);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !form.toEntityId ||
      !form.amount ||
      !form.country ||
      !form.description
    ) {
      alert("Please fill all required fields");
      return;
    }

    // Create FormData dynamically from form state
    const formData = new FormData();
    formData.append("fromEntityId", form.fromEntityId);
    formData.append("fromEntityType", form.fromEntityType);
    formData.append("toEntityId", form.toEntityId);
    formData.append("toEntityType", form.toEntityType);
    formData.append("operationType", form.oprationType); // Note: typo in property name (oprationType)
    formData.append("amountType", form.amountType);
    formData.append("amount", form.amount);
    formData.append("country", form.country);
    formData.append("description", form.description);

    // Append optional fields only if they have values
    if (form.note) formData.append("note", form.note);
    if (form.image) formData.append("image", form.image);

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://api.backend.t-coin.saveneed.com/tcoin/operation",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Add auth header if needed
          },
          body: formData,
        }
      );

      const responseText = await response.text();

      try {
        const result = responseText ? JSON.parse(responseText) : {};
        if (response.ok && result.success) {
          alert(result.message || "Transaction Successful!");
        } else {
          throw new Error(
            result.message || `Operation failed with status ${response.status}`
          );
        }
      } catch {
        if (response.ok) {
          throw new Error("Unexpected response format from server.");
        } else if (responseText.startsWith("<!DOCTYPE html>")) {
          throw new Error("Server error occurred. Please try again later.");
        } else {
          throw new Error(
            `Server responded with: ${response.status} ${response.statusText}`
          );
        }
      }
    } catch (error) {
      console.error("Transaction Error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Transaction failed. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount */}
              <div className="space-y-2">
                <Label>Amount (T-Coin)</Label>
                <Input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Enter amount"
                  required
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label>Country</Label>
                <Select
                  value={form.country}
                  onValueChange={(value) =>
                    setForm({ ...form, country: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Transaction description"
                  required
                  rows={3}
                />
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label>Note (Optional)</Label>
                <Textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Additional notes"
                  rows={2}
                />
              </div>

              {/* Image */}
              <div className="space-y-2">
                <Label>Image (Optional)</Label>
                <Input
                  type="file"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.files ? e.target.files[0] : null,
                    })
                  }
                  accept="image/*"
                />
              </div>

              <Button
                type="submit"
                className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
