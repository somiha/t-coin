"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CampaignType = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  image: string;
  description?: string;
  slotNumber?: number;
  active_status?: boolean;
};

type ToastType = {
  show: boolean;
  message: string;
  type: "success" | "error";
};

export default function Campaign() {
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCampaign, setEditingCampaign] = useState<CampaignType | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastType>({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
  };

  const fetchCampaigns = () => {
    setLoading(true);
    fetch("http://api.t-coin.code-studio4.com/api/campaign")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setCampaigns(data.data);
        }
      })
      .catch((err) => console.error("Error fetching campaigns:", err))
      .finally(() => setLoading(false));
  };

  const handleEditClick = (campaign: CampaignType) => {
    setEditingCampaign(campaign);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", editingCampaign.name);
      formData.append(
        "startDate",
        new Date(editingCampaign.startDate).toISOString()
      );
      formData.append(
        "endDate",
        new Date(editingCampaign.endDate).toISOString()
      );
      if (editingCampaign.slotNumber)
        formData.append("slotNumber", editingCampaign.slotNumber.toString());
      if (editingCampaign.description)
        formData.append("description", editingCampaign.description);
      formData.append(
        "active_status",
        editingCampaign.active_status ? "true" : "false"
      );

      const response = await fetch(
        `http://api.t-coin.code-studio4.com/api/campaign/${editingCampaign.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        showToast("Campaign updated successfully", "success");
        fetchCampaigns();
        setIsEditDialogOpen(false);
      } else {
        showToast(data.message || "Failed to update campaign", "error");
      }
    } catch (error) {
      showToast("An error occurred while updating the campaign", "error");
      console.error("Error updating campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingCampaign) return;
    setEditingCampaign({
      ...editingCampaign,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Millionaire Campaign
              </h1>
              <Link href="/millionaire-campaign/add-campaign">
                <Button className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90">
                  + Add New
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading campaigns...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {campaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    className="flex flex-col border-[#FFDEDE] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative w-full h-48 sm:h-56 md:h-64">
                      <Image
                        src={campaign.image}
                        alt={campaign.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    <div className="flex flex-col flex-grow p-4">
                      <CardHeader className="flex flex-row items-center justify-between p-0 pb-3">
                        <CardTitle className="text-lg font-semibold line-clamp-1">
                          {campaign.name}
                        </CardTitle>
                        <div className="flex space-x-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90 h-8 w-8"
                            onClick={() => handleEditClick(campaign)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          {/* <Button
                            size="icon"
                            variant="ghost"
                            className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90 h-8 w-8"
                          >
                            <Trash className="w-4 h-4" />
                          </Button> */}
                        </div>
                      </CardHeader>

                      <CardContent className="flex-grow p-0">
                        <div className="text-sm text-gray-600 mb-4">
                          <p className="text-[#D4136B] font-medium">
                            {new Date(campaign.startDate).toLocaleDateString()}{" "}
                            - {new Date(campaign.endDate).toLocaleDateString()}
                          </p>
                          <p className="mt-2 text-gray-700">
                            {campaign.description ||
                              "Those who are lucky will be able to win a prize at the end of the campaign."}
                          </p>
                        </div>
                      </CardContent>

                      <CardFooter className="p-0 mt-auto">
                        <div className="flex w-full gap-2">
                          <Link
                            href={`/millionaire-campaign/participant-list/${campaign.id}`}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              className="w-full text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] rounded-md"
                            >
                              Participants
                            </Button>
                          </Link>
                        </div>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Campaign Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          {editingCampaign && (
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={editingCampaign.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    value={new Date(editingCampaign.startDate)
                      .toISOString()
                      .slice(0, 16)}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    value={new Date(editingCampaign.endDate)
                      .toISOString()
                      .slice(0, 16)}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="slotNumber" className="text-right">
                    Slot Number
                  </Label>
                  <Input
                    id="slotNumber"
                    name="slotNumber"
                    type="number"
                    value={editingCampaign.slotNumber || ""}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={editingCampaign.description || ""}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="active_status" className="text-right">
                    Active Status
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <input
                      id="active_status"
                      name="active_status"
                      type="checkbox"
                      checked={editingCampaign.active_status || false}
                      onChange={(e) =>
                        setEditingCampaign({
                          ...editingCampaign,
                          active_status: e.target.checked,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="active_status">
                      {editingCampaign.active_status ? "Active" : "Inactive"}
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
