"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function AddCampaign() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    slotNumber: 0,
    description: "",
    active_status: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      active_status: e.target.checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append(
        "startDate",
        new Date(formData.startDate).toISOString()
      );
      formDataToSend.append(
        "endDate",
        new Date(formData.endDate).toISOString()
      );
      formDataToSend.append("slotNumber", formData.slotNumber.toString());
      formDataToSend.append("description", formData.description);
      formDataToSend.append("active_status", formData.active_status.toString());
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const response = await fetch(
        "https://api.backend.t-coin.saveneed.com/api/campaign/create",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (data.success) {
        setNotification({
          show: true,
          message: "Campaign created successfully!",
          type: "success",
        });
        // Reset form
        setFormData({
          name: "",
          startDate: "",
          endDate: "",
          slotNumber: 0,
          description: "",
          active_status: true,
        });
        setImageFile(null);
      } else {
        setNotification({
          show: true,
          message: data.message || "Failed to create campaign",
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        show: true,
        message: "An error occurred while creating the campaign",
        type: "error",
      });
      console.error("Error creating campaign:", error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Add New Campaign</h2>
        <Link href="/millionaire-campaign">
          <Button variant="outline">Back to Campaigns</Button>
        </Link>
      </div>

      {notification.show && (
        <div
          className={`mb-4 p-4 rounded-md ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.message}
        </div>
      )}

      <Card className="w-full">
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className="w-full max-w-[600px]">
              <Label className="block mb-2 text-md font-medium">
                Campaign Image
              </Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={handleClick}
              >
                <Input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center gap-4">
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
                  <p className="text-sm text-gray-500">
                    {imageFile ? imageFile.name : "Click to upload image"}
                  </p>
                </div>
              </div>
            </div>

            {/* Campaign Name */}
            <div className="w-full max-w-[600px]">
              <Label htmlFor="name" className="block mb-2 text-md font-medium">
                Campaign Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Start Date */}
            <div className="w-full max-w-[600px]">
              <Label
                htmlFor="startDate"
                className="block mb-2 text-md font-medium"
              >
                Start Date
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* End Date */}
            <div className="w-full max-w-[600px]">
              <Label
                htmlFor="endDate"
                className="block mb-2 text-md font-medium"
              >
                End Date
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Slot Number */}
            <div className="w-full max-w-[600px]">
              <Label
                htmlFor="slotNumber"
                className="block mb-2 text-md font-medium"
              >
                Slot Number
              </Label>
              <Input
                id="slotNumber"
                name="slotNumber"
                type="number"
                value={formData.slotNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Description */}
            <div className="w-full max-w-[600px]">
              <Label
                htmlFor="description"
                className="block mb-2 text-md font-medium"
              >
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-24"
              />
            </div>

            {/* Active Status */}
            <div className="w-full max-w-[600px] flex items-center space-x-2">
              <input
                id="active_status"
                name="active_status"
                type="checkbox"
                checked={formData.active_status}
                onChange={handleCheckboxChange}
                className="h-4 w-4"
              />
              <Label htmlFor="active_status" className="text-md font-medium">
                Active Campaign
              </Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Campaign"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    name: "",
                    startDate: "",
                    endDate: "",
                    slotNumber: 0,
                    description: "",
                    active_status: true,
                  });
                  setImageFile(null);
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
