"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AddCurrency() {
  const router = useRouter();

  const [form, setForm] = useState({
    from_currency: "",
    rate: "",
    country: "",
  });

  const currencies = [
    { value: "USD", label: "United States Dollar" },
    { value: "EUR", label: "Euro" },
    { value: "GBP", label: "British Pound" },
    { value: "AUD", label: "Australian Dollar" },
    { value: "CAD", label: "Canadian Dollar" },
    { value: "CHF", label: "Swiss Franc" },
    { value: "BDT", label: "Bangladeshi Taka" },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    if (!form.from_currency || !form.rate || !form.country) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(
        "https://api.t-coin.code-studio4.com/api/tcoin-rates",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from_currency: form.from_currency,
            rate: parseFloat(form.rate),
            country: form.country,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Currency added successfully!");
        router.push("/currency-rate");
      } else {
        alert(data.message || "Failed to add currency.");
      }
    } catch (error) {
      console.error("Error submitting currency:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Currency</h2>

      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 space-y-6 lg:pl-16 md:pl-1">
            {/* Select Currency */}
            <div className="w-full max-w-[600px]">
              <Label className="block mb-4 text-md font-medium">
                Select Currency Type
              </Label>

              <Select
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, from_currency: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Currencies</SelectLabel>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Currency Rate */}
            <div className="w-full max-w-[600px]">
              <Label className="block mb-4 text-md font-medium">
                Currency Rate
              </Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                value={form.rate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, rate: e.target.value }))
                }
                required
              />
            </div>

            {/* Country Name */}
            <div className="w-full max-w-[600px]">
              <Label className="block mb-4 text-md font-medium">Country</Label>
              <Input
                id="country"
                type="text"
                value={form.country}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, country: e.target.value }))
                }
                required
              />
            </div>

            <Button
              className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white"
              type="submit"
            >
              Save
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
