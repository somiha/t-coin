"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function AddBankPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    type: "mobile",
    country: "",
    supported_methods: [] as string[],
    active: true,
  });

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMethodChange = (method: string, checked: boolean) => {
    setForm((prev) => {
      const methods = [...prev.supported_methods];
      if (checked && !methods.includes(method)) {
        methods.push(method);
      } else if (!checked) {
        const index = methods.indexOf(method);
        if (index > -1) methods.splice(index, 1);
      }
      return { ...prev, supported_methods: methods };
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.country || form.supported_methods.length === 0) {
      alert("Please fill all required fields");
      return;
    }

    if (!imageFile) {
      alert("Please upload a bank logo/image");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("type", form.type);
    formData.append("country", form.country);
    form.supported_methods.forEach((method) => {
      formData.append("supported_methods[]", method);
    });
    formData.append("active", String(form.active));
    formData.append("image", imageFile);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://api.t-coin.code-studio4.com/api/bank/create",
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Bank added successfully!");
        router.push("/banks");
      } else {
        console.error("Failed to add bank:", result.message);
        alert(result.message || "Failed to add bank");
      }
    } catch (error) {
      console.error("Error submitting bank:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">Add New Bank</h2>
      <Card className="w-full">
        <CardContent className="p-6 space-y-6 lg:pl-16 md:pl-1">
          <div className="w-full max-w-[600px] space-y-4">
            {/* Image Upload */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleClick}
            >
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".png,.svg,.jpg,.jpeg"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="group relative h-12 w-12 rounded-full bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white shadow-lg hover:shadow-xl"
                >
                  <div>
                    <PlusCircle className="h-6 w-6" />
                  </div>
                </Button>
                <p className="text-sm text-gray-500">Upload Bank Logo</p>
                {imageFile && (
                  <p className="text-xs text-green-600">{imageFile.name}</p>
                )}
              </div>
            </div>

            {/* Form Inputs */}
            <Input
              name="name"
              placeholder="Bank Name"
              value={form.name}
              onChange={handleChange}
            />

            <div className="space-y-2">
              <Label>Bank Type</Label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="mobile">Mobile Banking</option>
                <option value="bank">Traditional Bank</option>
              </select>
            </div>

            <Input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
            />

            <div className="space-y-2">
              <Label>Supported Methods *</Label>
              <div className="flex flex-col gap-2">
                {["cash in", "cash out"].map((method) => (
                  <label key={method} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.supported_methods.includes(method)}
                      onChange={(e) =>
                        handleMethodChange(method, e.target.checked)
                      }
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label>Active</Label>
              <Switch
                checked={form.active}
                onCheckedChange={(checked) =>
                  setForm({ ...form, active: checked })
                }
              />
            </div>

            <Button
              className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white w-full"
              size="md"
              type="button"
              onClick={handleSubmit}
            >
              Add Bank
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
