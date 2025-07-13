"use client";

import Image from "next/image";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface InvestmentFormData {
  title: string;
  description: string;
  total_needed: string;
  profit_or_loss: string;
  hide_status: boolean;
  active_status: boolean;
  refund_status: boolean;
  image?: File | null;
}

export default function EditInvestment() {
  const { investmentId } = useParams() as { investmentId: string };
  const router = useRouter();

  const [formData, setFormData] = useState<InvestmentFormData>({
    title: "",
    description: "",
    total_needed: "",
    profit_or_loss: "",
    hide_status: false,
    active_status: false,
    refund_status: false,
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    if (!investmentId) return;

    fetch(
      `http://api.t-coin.code-studio4.com/api/investment-projects/${investmentId}`
    )
      .then((res) => res.json())
      .then((response) => {
        const investment = response?.data;
        if (investment?.id) {
          setFormData({
            title: investment.title,
            description: investment.description,
            total_needed: investment.total_needed,
            profit_or_loss: investment.profit_or_loss,
            hide_status: investment.hide_status,
            active_status: investment.active_status,
            refund_status: investment.refund_status,
            image: null,
          });
          setPreviewUrl(investment.image);
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [investmentId]);

  // Handle inputs except file
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [id]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  // Handle file input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!investmentId) return;
    setSaving(true);

    try {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");
      const adminType = localStorage.getItem("adminType");

      if (!userStr || !token || !adminType) {
        alert("Authorization error. Please login again.");
        setSaving(false);
        return;
      }

      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("total_needed", formData.total_needed);
      form.append("profit_or_loss", formData.profit_or_loss);
      form.append("hide_status", String(formData.hide_status));
      form.append("active_status", String(formData.active_status));
      form.append("refund_status", String(formData.refund_status));
      if (formData.image) form.append("image", formData.image);

      const response = await fetch(
        `http://api.t-coin.code-studio4.com/api/investment-projects/${investmentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Investment updated successfully.");
        router.push(`/investment/${investmentId}`);
      } else {
        alert(data.message || "Failed to update investment.");
      }
    } catch (error) {
      console.error("Error updating investment:", error);
      alert("An error occurred while updating.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Edit Investment</h2>
      <Card className="max-w-2xl">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image preview and upload */}
            <div>
              <Label className="block mb-2">Image</Label>
              {previewUrl && (
                <div className="mb-2 w-40 h-32 relative border rounded overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="total_needed">Total Needed</Label>
              <Input
                id="total_needed"
                type="number"
                min="0"
                step="0.01"
                value={formData.total_needed}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="profit_or_loss">Profit or Loss (%)</Label>
              <Input
                id="profit_or_loss"
                type="number"
                step="0.01"
                value={formData.profit_or_loss}
                onChange={handleChange}
              />
            </div>

            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  id="hide_status"
                  type="checkbox"
                  checked={formData.hide_status}
                  onChange={handleChange}
                />
                <span>Hide Status</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  id="active_status"
                  type="checkbox"
                  checked={formData.active_status}
                  onChange={handleChange}
                />
                <span>Active Status</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  id="refund_status"
                  type="checkbox"
                  checked={formData.refund_status}
                  onChange={handleChange}
                />
                <span>Refund Status</span>
              </label>
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
