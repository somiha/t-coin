"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRef, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AddInvestment() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    total_needed: "",
    profit_or_loss: "",
    hide_status: false,
    active_status: true,
    refund_status: false,
  });

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");

    if (!userStr || !token) {
      alert("Authorization error. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("total_needed", form.total_needed);
    formData.append("profit_or_loss", form.profit_or_loss || "0");
    formData.append("hide_status", String(form.hide_status));
    formData.append("active_status", String(form.active_status));
    formData.append("refund_status", String(form.refund_status));
    if (imageFile) formData.append("image", imageFile);
    setLoading(true);
    try {
      const res = await fetch(
        "https://api.t-coin.code-studio4.com/api/investment-projects",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Investment added successfully!");
        router.push("/investment");
      } else {
        alert(data.message || "Failed to add investment.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Add Investment</h2>
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 space-y-6">
            {/* Image Upload */}
            <div>
              <Label className="mb-2 block text-md">Image</Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
                onClick={handleClick}
              >
                <Input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={160}
                    height={120}
                    className="object-cover mx-auto rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <PlusCircle className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-400">
                      Click to upload image
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
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
                value={form.total_needed}
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
                value={form.profit_or_loss}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hide_status"
                  checked={form.hide_status}
                  onChange={handleChange}
                />
                <span>Hide</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active_status"
                  checked={form.active_status}
                  onChange={handleChange}
                />
                <span>Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="refund_status"
                  checked={form.refund_status}
                  onChange={handleChange}
                />
                <span>Refundable</span>
              </label>
            </div>

            <Button
              type="submit"
              className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
