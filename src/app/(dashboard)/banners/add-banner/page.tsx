"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

export default function AddBannerPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
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
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      alert("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("link", form.link);
    formData.append("active", String(form.active));
    formData.append("image", imageFile);

    try {
      const token = localStorage.getItem("authToken"); // optional
      const response = await fetch(
        "https://api.t-coin.code-studio4.com/api/banners",
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
        alert("Banner added successfully!");
        window.location.href = "/banners"; // redirect to banner list
      } else {
        console.error("Failed to add banner:", result.message);
        alert("Failed to add banner.");
      }
    } catch (error) {
      console.error("Error submitting banner:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">Add New Banner</h2>
      <Card className="w-full">
        <CardContent className="p-6 space-y-6 lg:pl-16 md:pl-1">
          <div className="w-full max-w-[600px] space-y-4">
            <div className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] p-3 rounded-md">
              ⚠️ Banner size must be **350px × 150px**
            </div>

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
                <p className="text-sm text-gray-500">Upload Image</p>
                {imageFile && (
                  <p className="text-xs text-green-600">{imageFile.name}</p>
                )}
              </div>
            </div>

            {/* Form Inputs */}
            <Input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
            />
            <Input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />
            <Input
              name="link"
              placeholder="Link"
              value={form.link}
              onChange={handleChange}
            />

            <Button
              className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white w-full"
              size="md"
              type="submit"
              onClick={handleSubmit}
            >
              Save Banner
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
