"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Investment {
  id: number;
  title: string;
  description: string;
  total_needed: string;
  total_invested: string;
  profit_or_loss: string;
  hide_status: boolean;
  active_status: boolean;
  refund_status: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export default function InvestmentDetails() {
  const { investmentId } = useParams() as { investmentId: string };
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!investmentId) return;

    fetch(
      `http://api.t-coin.code-studio4.com/api/investment-projects/${investmentId}`
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.success && response.data) {
          setInvestment(response.data);
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [investmentId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!investment) return <p className="p-6">Investment not found</p>;

  return (
    <div className="p-6">
      <div className="p-6 flex justify-between">
        <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
        <Link href={`/investment/${investmentId}/edit-investment`}>
          <Button className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white">
            Edit
          </Button>
        </Link>
      </div>

      <Card className="w-full">
        <CardContent className="p-6 space-y-6 lg:pl-16 md:pl-1">
          {/* Image */}
          <div className="w-full max-w-[600px]">
            <Label className="block mb-2 text-md font-medium">Image</Label>
            <Image
              src={investment.image}
              alt={investment.title}
              width={150}
              height={140}
              className="rounded-md border object-cover"
            />
          </div>

          <div className="w-full max-w-[600px]">
            <Label className="block mb-4 text-md font-medium">Title</Label>
            <Input value={investment.title} readOnly />
          </div>

          <div className="w-full max-w-[600px]">
            <Label className="block mb-4 text-md font-medium">
              Created Date
            </Label>
            <Input
              value={new Date(investment.createdAt).toLocaleDateString()}
              readOnly
            />
          </div>

          <div className="w-full max-w-[600px]">
            <Label className="block mb-4 text-md font-medium">
              Profit or Loss (%)
            </Label>
            <Input value={investment.profit_or_loss} readOnly />
          </div>

          <div className="w-full max-w-[600px]">
            <Label className="block mb-4 text-md font-medium">
              Total Needed
            </Label>
            <Input value={investment.total_needed} readOnly />
          </div>

          <div className="w-full max-w-[600px]">
            <Label className="block mb-4 text-md font-medium">
              Total Invested
            </Label>
            <Input value={investment.total_invested} readOnly />
          </div>

          <div className="w-full max-w-[600px]">
            <Label className="block mb-4 text-md font-medium">
              Description
            </Label>
            <Textarea
              value={investment.description}
              readOnly
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
