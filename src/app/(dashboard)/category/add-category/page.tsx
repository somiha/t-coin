"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function AddCategoryPage() {
  const [form, setForm] = useState({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name) {
      alert("Please enter a category name");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://api.t-coin.code-studio4.com/api/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            name: form.name,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Category added successfully!");
        router.push("/category"); // Using Next.js router instead of window.location
      } else {
        console.error("Failed to add category:", result.message);
        alert(result.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Error submitting category:", error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter category name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <Button
            className="w-full bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Category"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
