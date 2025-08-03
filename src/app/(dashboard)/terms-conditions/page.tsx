"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface TermsType {
  id: number;
  title: string;
  content: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TermsAndConditionsPage() {
  const [terms, setTerms] = useState<TermsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Missing auth token");
      }

      const response = await fetch(
        "https://api.backend.t-coin.saveneed.com/api/terms-and-conditions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setTerms(data.data.termsOfService);
        setFormData({
          title: data.data.termsOfService.title,
          content: data.data.termsOfService.content,
        });
      } else {
        throw new Error(data.message || "Failed to fetch terms");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch terms"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Missing auth token");
      }

      const response = await fetch(
        "https://api.backend.t-coin.saveneed.com/api/terms-and-conditions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Terms and conditions updated successfully");
        setEditMode(false);
        fetchTerms();
      } else {
        throw new Error(data.message || "Failed to update terms");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update terms"
      );
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Terms and Conditions</h2>
        {!editMode && (
          <Button
            className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
            onClick={() => setEditMode(true)}
          >
            Edit Terms
          </Button>
        )}
      </div>

      <Card className="w-full">
        <CardContent className="p-6">
          {editMode ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="min-h-[300px]"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
                  type="submit"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
                  onClick={() => {
                    setEditMode(false);
                    if (terms) {
                      setFormData({
                        title: terms.title,
                        content: terms.content,
                      });
                    }
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : terms ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">{terms.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(terms.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="prose max-w-none">
                {terms.content.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          ) : (
            <div>No terms and conditions found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
