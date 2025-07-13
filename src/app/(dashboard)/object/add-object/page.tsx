"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

// Define all required types directly in the component
interface Category {
  id: number;
  name: string;
}

interface GameFormData {
  title: string;
  details: string;
  link: string;
  categoryId: string;
  priority: number;
  image: File | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export default function AddObjectPage() {
  const [form, setForm] = useState<GameFormData>({
    title: "",
    details: "",
    link: "",
    categoryId: "",
    priority: 1,
    image: null,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await fetch(
          "https://api.t-coin.code-studio4.com/api/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data: ApiResponse<Category[]> = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!form.title || !form.details || !form.link || !form.categoryId) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();

      // Append all form fields to FormData
      formData.append("title", form.title);
      formData.append("details", form.details);
      formData.append("link", form.link);
      formData.append("categoryId", form.categoryId);
      formData.append("priority", form.priority.toString());
      if (form.image) {
        formData.append("image", form.image);
      }

      const response = await fetch(
        "https://api.t-coin.code-studio4.com/api/objects",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result: ApiResponse<unknown> = await response.json();

      if (result.success) {
        alert("Game object added successfully!");
        router.push("/object");
      } else {
        alert(result.message || "Failed to add game object");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">Add New Game Object</h2>
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6 space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter game title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Details Field */}
          <div className="space-y-2">
            <Label htmlFor="details">Details *</Label>
            <Input
              id="details"
              name="details"
              placeholder="Enter game details"
              value={form.details}
              onChange={handleChange}
              required
            />
          </div>

          {/* Link Field */}
          <div className="space-y-2">
            <Label htmlFor="link">Link *</Label>
            <Input
              id="link"
              name="link"
              placeholder="Enter game URL"
              value={form.link}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category *</Label>
            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Field */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Input
              type="number"
              id="priority"
              name="priority"
              min="1"
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: Number(e.target.value) })
              }
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Game Image</Label>
            <Input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Submit Button */}
          <Button
            className="w-full bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Add Game Object"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
